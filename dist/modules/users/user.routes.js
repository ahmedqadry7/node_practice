"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_1 = require("../../middlewares/authentication");
const errorhandling_1 = require("../../utils/errorhandling");
const userCtr = __importStar(require("./user.ctr"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/signUp', (0, errorhandling_1.asyncHandler)(userCtr.signUp));
router.post('/signIn', (0, errorhandling_1.asyncHandler)(userCtr.signIn));
router.post('/verifyToken', (0, errorhandling_1.asyncHandler)(userCtr.verifyToken));
router.patch('/updateProfile/:userId', (0, errorhandling_1.asyncHandler)(userCtr.updateProfile));
router.patch('/updateProfileMid', (0, authentication_1.isAuth)(), (0, errorhandling_1.asyncHandler)(userCtr.updateProfileMid));
router.get('/getUser', (0, authentication_1.isAuth)(), (0, errorhandling_1.asyncHandler)(userCtr.getUser));
exports.default = router;
