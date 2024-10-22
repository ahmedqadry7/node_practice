import { NextFunction, Request, Response } from "express"

export const asyncHandler = (API: any) => {
    return (req: Request, res: Response, next: NextFunction) => {
        API(req, res, next).catch((err: Error) => {
            console.log(err);

            res.status(500).json({ message: 'Failed from Error handler' })
        })
    }
}