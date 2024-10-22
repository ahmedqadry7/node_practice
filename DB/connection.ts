import mongoose from "mongoose";

export const connection = async () => {
    return await mongoose.connect('mongodb://localhost:27017/practiceMySelf')
        .then((res) => console.log('DB Connection success'))
        .catch((err) => console.log('DB Connection failed'))
}