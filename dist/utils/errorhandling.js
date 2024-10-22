"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = void 0;
const asyncHandler = (API) => {
    return (req, res, next) => {
        API(req, res, next).catch((err) => {
            console.log(err);
            res.status(500).json({ message: 'Failed from Error handler' });
        });
    };
};
exports.asyncHandler = asyncHandler;
