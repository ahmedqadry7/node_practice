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
exports.isAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../DB/models/user.model");
//Make sure that you're logged in (Authentication)
const isAuth = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        //Take token from headers
        const { authorization } = req.headers;
        if (!authorization) {
            res.status(400).json({ message: 'Please Login first' });
            return;
        }
        //Check for prefix of auth
        if (!(authorization === null || authorization === void 0 ? void 0 : authorization.startsWith('authed'))) {
            res.status(400).json({ message: 'Invalid Prefix' });
            return;
        }
        //Split token
        const splitted = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        //Decode data with secret key 'testToken'
        const decodedData = jsonwebtoken_1.default.verify(splitted, 'testToken');
        if (!decodedData || !decodedData._id) {
            res.status(400).json({ message: 'Invalid token' });
            return;
        }
        const finduser = yield user_model_1.userModel.findById(decodedData._id);
        if (!finduser) {
            res.status(400).json({ message: 'Please Sign Up' });
            return;
        }
        req.authUser = finduser;
        next();
    });
};
exports.isAuth = isAuth;
