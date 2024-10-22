import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { userModel } from "../DB/models/user.model"

//To add attribute in request in my code:
declare module 'express' {
    export interface Request {
        authUser?: any;
    }
}

//Make sure that you're logged in (Authentication)
export const isAuth = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        //Take token from headers
        const { authorization } = req.headers
        if (!authorization) {
            res.status(400).json({ message: 'Please Login first' })
            return
        }

        //Check for prefix of auth
        if (!authorization?.startsWith('authed')) {
            res.status(400).json({ message: 'Invalid Prefix' })
            return
        }

        //Split token
        const splitted: any = authorization?.split(' ')[1]
        //Decode data with secret key 'testToken'
        const decodedData: any = jwt.verify(splitted, 'testToken')
        if (!decodedData || !decodedData._id) {
            res.status(400).json({ message: 'Invalid token' })
            return
        }

        const finduser = await userModel.findById(decodedData._id)
        if (!finduser) {
            res.status(400).json({ message: 'Please Sign Up' })
            return
        }

        req.authUser = finduser;
        next()

    }
}