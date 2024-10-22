"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileMid = exports.getUser = exports.updateProfile = exports.verifyToken = exports.signIn = exports.signUp = void 0;
const user_model_1 = require("../../DB/models/user.model");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Sign up and add data to DB
const signUp = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, gender, age } = req.body;
    const existingUser = yield user_model_1.userModel.findOne({ email });
    if (existingUser)
        res.json({ message: 'Email already exists' });
    const saltRounds = process.env.SALT_ROUNDS ? parseInt(process.env.SALT_ROUNDS, 10) : 10;
    //To encrypt password
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    const user = new user_model_1.userModel({
        username,
        email,
        password: hashedPassword,
        gender,
        age
    });
    yield user.save();
    res.status(201).json({ message: 'Done', user });
});
exports.signUp = signUp;
//Sign in and create token for user
const signIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isUserExist = yield user_model_1.userModel.findOne({ email });
    if (!isUserExist) {
        return res.status(400).json({ message: 'in-valid login credentials' });
    }
    const passMatch = bcrypt_1.default.compareSync(password, isUserExist.password);
    if (!passMatch)
        res.status(400).json({ message: 'in-valid login credentials' });
    //                           (data that I want to store in token)                  (secret key that decodes token)
    const userToken = jsonwebtoken_1.default.sign({ email, username: isUserExist.username, _id: isUserExist._id }, 'testToken', { expiresIn: '1h' });
    res.status(200).json({ message: 'LoggedIn success', userToken });
    return;
});
exports.signIn = signIn;
//Method to decode token and returns data stored in token
//Token should be sent in one of [headers , bearer , authorization]
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //1---------Headers---------
    // const token = req.headers['authorization']
    // if (!token) {
    //     res.status(400).json({ message: 'Token is not availabe' })
    //     return
    // }
    //                                    (secret key)
    //const decodedData = jwt.verify(token, 'testToken')
    //2---------Bearer---------
    const authorization = req.headers['authorization'];
    if (!authorization) {
        res.status(400).json({ message: 'Token is not availabe' });
        return;
    }
    console.log({ authorization });
    console.log(authorization.split(" ")[1]);
    const decodedData = jsonwebtoken_1.default.verify(authorization.split(" ")[1], 'testToken');
    res.json({ message: 'Decoded successfully', decodedData });
    return;
});
exports.verifyToken = verifyToken;
//Function to update username but check first if the owner himself is updating
//This function checks for authentication and authorization also
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Take token from headers / bearer
    const authorization = req.headers['authorization'];
    if (!authorization) {
        res.status(400).json({ message: 'Token is not availabe' });
        return;
    }
    //Decode data exists in token
    const decodedData = jsonwebtoken_1.default.verify(authorization.split(" ")[1], 'testToken');
    //Take id from parameters
    const { userId } = req.params;
    //Take updated data from body
    const { username } = req.body;
    const userExists = yield user_model_1.userModel.findById(userId);
    if (!userExists) {
        res.status(400).json({ message: 'No user found' });
        return;
    }
    //Check that passwords are matched between password in token and password in parameters
    if (userExists._id.toString() !== decodedData._id) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
    }
    //Update data to user after checking
    const updatedUser = yield user_model_1.userModel.findByIdAndUpdate({ _id: userId }, { username }, { new: true });
    res.status(200).json({ message: 'Updated Successfully', updatedUser });
    return;
});
exports.updateProfile = updateProfile;
//======================================Functions with Middleware==============================================
//Get user data of signed-in user by token by using middleware to check for authentication
const getUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //Taken from new object of user I made in middleware
    const { _id } = req.authUser;
    const user = yield user_model_1.userModel.findById(_id, 'username gender email');
    if (!user) {
        res.status(400).json({ message: 'in-valid userId' });
        return;
    }
    res.status(200).json({ message: 'Done', user });
    return;
});
exports.getUser = getUser;
//This function is update profile with middleware of Authentication I made by myself
const updateProfileMid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.authUser;
    const { username } = req.body;
    const updatedUser = yield user_model_1.userModel.findByIdAndUpdate({ _id }, { username }, { new: true });
    res.status(200).json({ message: 'Updated Successfully', updatedUser });
    return;
});
exports.updateProfileMid = updateProfileMid;
