import dotenv from "dotenv"
dotenv.config({
    path:'./.env',
})


import connectDB from "./db/index.db.js"
import app from "./app.js"
import { PORT } from "./constant.js"



connectDB()
    .then(()=>{
        app.on("error",(error)=>{
            console.log('App listening error', error)
            throw error
        })
        
        app.listen(PORT,()=>{
            console.log(`Server is running  at the PORT ${PORT}`);
        })
    })
    .catch((error)=>{
        console.log("MongoDB connection error.",error);
    })