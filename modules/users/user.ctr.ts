import { NextFunction, Request, Response } from "express";
import { userModel } from "../../DB/models/user.model";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'


//Sign up and add data to DB
export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, gender, age } = req.body;

    const existingUser = await userModel.findOne({ email });
    if (existingUser)
        res.json({ message: 'Email already exists' })

    const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
    //To encrypt password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new userModel({
        username,
        email,
        password: hashedPassword,
        gender,
        age
    })
    await user.save()
    res.status(201).json({ message: 'Done', user });
}

//Sign in and create token for user
export const signIn = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body
    const isUserExist = await userModel.findOne({ email })
    if (!isUserExist) {
        return res.status(400).json({ message: 'in-valid login credentials' })
    }
    const passMatch = bcrypt.compareSync(password, isUserExist.password)
    if (!passMatch)
        res.status(400).json({ message: 'in-valid login credentials' })
    //                           (data that I want to store in token)                  (secret key that decodes token)
    const userToken = jwt.sign({ email, username: isUserExist.username, _id: isUserExist._id }, 'testToken', { expiresIn: '1h' })
    res.status(200).json({ message: 'LoggedIn success', userToken })
    return
}



//Method to decode token and returns data stored in token
//Token should be sent in one of [headers , bearer , authorization]
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    //1---------Headers---------
    // const token = req.headers['authorization']
    // if (!token) {
    //     res.status(400).json({ message: 'Token is not availabe' })
    //     return
    // }
    //                                    (secret key)
    //const decodedData = jwt.verify(token, 'testToken')

    //2---------Bearer---------
    const authorization = req.headers['authorization']
    if (!authorization) {
        res.status(400).json({ message: 'Token is not availabe' })
        return
    }
    console.log({ authorization });
    console.log(authorization.split(" ")[1]);

    const decodedData = jwt.verify(authorization.split(" ")[1], 'testToken')
    res.json({ message: 'Decoded successfully', decodedData })
    return
}


//Function to update username but check first if the owner himself is updating
//This function checks for authentication and authorization also
export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
    //Take token from headers / bearer
    const authorization = req.headers['authorization']
    if (!authorization) {
        res.status(400).json({ message: 'Token is not availabe' })
        return
    }

    //Decode data exists in token
    const decodedData: any = jwt.verify(authorization.split(" ")[1], 'testToken')

    //Take id from parameters
    const { userId } = req.params
    //Take updated data from body
    const { username } = req.body

    const userExists = await userModel.findById(userId)
    if (!userExists) {
        res.status(400).json({ message: 'No user found' })
        return
    }

    //Check that passwords are matched between password in token and password in parameters
    if (userExists._id.toString() !== decodedData._id) {
        res.status(401).json({ message: 'Unauthorized' });
        return
    }

    //Update data to user after checking
    const updatedUser = await userModel.findByIdAndUpdate(
        { _id: userId },
        { username },
        { new: true }
    )
    res.status(200).json({ message: 'Updated Successfully', updatedUser })
    return
}

//======================================Functions with Middleware==============================================

//Get user data of signed-in user by token by using middleware to check for authentication
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    //Taken from new object of user I made in middleware
    const { _id } = req.authUser
    const user = await userModel.findById(_id, 'username gender email')
    if (!user) {
        res.status(400).json({ message: 'in-valid userId' });
        return
    }
    res.status(200).json({ message: 'Done', user });
    return
}


//This function is update profile with middleware of Authentication I made by myself
export const updateProfileMid = async (req: Request, res: Response) => {
    const { _id } = req.authUser
    const { username } = req.body
    const updatedUser = await userModel.findByIdAndUpdate(
        { _id },
        { username },
        { new: true }
    )
    res.status(200).json({ message: 'Updated Successfully', updatedUser })
    return
}
