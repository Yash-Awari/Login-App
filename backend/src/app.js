import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import multer from "multer"

const app = express()
const upload = multer()

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
}))
console.log(process.env.CORS_ORIGIN)
console.log(process.env.REFRESH_TOKEN_DAYS);
console.log(process.env.MONGODB_URI);


app.use(express.json({ limit: "10kb" }))
app.use(express.urlencoded({ limit: "10kb", extended: true }))
app.use(express.static("public"))
app.use(cookieParser())
app.use(upload.none())

import userRouter from "./routes/user.router.js"

app.use("/api/v1/users",userRouter)

export default app