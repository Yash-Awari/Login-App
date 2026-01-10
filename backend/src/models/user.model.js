import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"
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
  },
  verified:{
    type:Boolean,
    default:false
  },
  verificationOtp:{
    type:String
  }
}, { timestamps: true })

userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return ;

  this.password = await bcrypt.hash(this.password, 10);
  
})

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      userName: this.userName,
      password: this.password
    },
    process.env.ACCESS_TOKEN_SECREATE,
    {
      expiresIn: process.env.ACCESS_TOKEN_DAYS
    }
  )
}

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_DAYS
    }
  )
}

export const User = mongoose.model("User", userSchema)

