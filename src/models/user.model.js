import mongoose, { Schema } from "mongoose"
import jwt, { sign } from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
    fullName: {
        required: true,
        type: String,
        index: true,
        trim: true,
        lowercase: true
    },
    userName: {
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required."]
    },
    refreshToken: {
        type: String
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {

    if (!this.isModified("password")) return next()

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.method.isPasswordCorrect = async function (password) {
    return await bcrypt.hash.compare(password, this.password)
}

User.methods.genarateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            userName:this.userName,
            password:this.password
        },
        process.env.ACCESS_TOKEN_SECREATE,
        {
            expiresIn:process.env.ACCESS_TOKEN_DAYS
        }
    )
}

User.methods.genarateRefreshToken = function(){
    return jwt.sign(
        {
            _id:tis._id,
        },
        process.env.REFRESH_TOKEN_SECRETE,
        {
            expiresIn:process.env.REFRESH_TOKEN_DAYS
        }
    )
}

export const User = mongoose.model("User", userSchema)

