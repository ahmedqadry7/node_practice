import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            lowercase: true
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        age: Number,
        gender: {
            type: String,
            enum: ['male', 'female', 'not specified'],
            default: 'not specified'
        }
    },
    {
        timestamps: true
    }
)

export const userModel = mongoose.model('User' , userSchema)