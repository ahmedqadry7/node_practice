import { isAuth } from '../../middlewares/authentication';
import { asyncHandler } from '../../utils/errorhandling';
import * as userCtr from './user.ctr'
import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post('/signUp', asyncHandler(userCtr.signUp));
router.post('/signIn', asyncHandler(userCtr.signIn));
router.post('/verifyToken', asyncHandler(userCtr.verifyToken));
router.patch('/updateProfile/:userId', asyncHandler(userCtr.updateProfile));
router.patch('/updateProfileMid', isAuth(),asyncHandler(userCtr.updateProfileMid));
router.get('/getUser', isAuth(), asyncHandler(userCtr.getUser));

export default router