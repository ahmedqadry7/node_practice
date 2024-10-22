import express, { Express, NextFunction, Request, Response } from "express"
import userRouter from './modules/users/user.routes'
import { connection } from './DB/connection.js'

const port = 3000
const app: Express = express();

app.use(express.json())
connection()
app.use('/users' , userRouter)

app.listen(port, () => {
    console.log(`now listening on port ${port}`);
})