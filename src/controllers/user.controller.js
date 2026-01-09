import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"


const genarateAccessTokenAndRefreshToken = async (userId) => {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()
    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })
    console.log(user);

    return { refreshToken, accessToken }
}

const registerUser = asyncHandler(async (req, res) => {

    // data recive
    //check the recived data
    //check if the user already exits
    //store data(mongoDB)
    //response of successsful send with data and without password

    const { fullName, userName, email, password } = req.body

    if ([fullName, userName, email, password]
        .some((fields) => fields?.trim() === "")
    ) {
        throw new ApiError(400, 'Required all information for registration')
    }

    const alreadyUserPresent = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (alreadyUserPresent) {
        throw new ApiError(401, "User already exits.")
    }


    const user = await User.create({
        fullName,
        userName,
        email,
        password
    })

    const createdUser = await User.findById(user?._id).select(
        "-password"
    )

    if (!createdUser) {
        throw new ApiError(500, 'User not created.')
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User successfully created."))
})

const loginUser = asyncHandler(async (req, res) => {

    //get email,password,username 
    //check if user is login
    //responese logged user 
    //store refresh token and access token

    console.log(req.body);
    const { userName, email, password } = req.body

    if (!(userName || email)) {
        throw new ApiError(400, "userName amd email required . ")
    }

    const user = await User.findOne({
        $or: [{ userName }, { email }]
    })

    if (!user) {
        throw new ApiError(400, "User not found.")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(400, "Incorrect Password.")
    }

    const { accessToken, refreshToken } = await genarateAccessTokenAndRefreshToken(user._id)

    const loggeduser = await User.findById(user._id).select(
        "-password"
    )

    const option = {
        httpOnly: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json(
            new ApiResponse(200, loggeduser, "User logged successFully")
        )
})

const changePassword = asyncHandler(async (req, res) => {
    const { oldpassword, newpassword } = req.body

    const user = await User.findById(req.user?._id)
    const checkPassword = await user.isPasswordCorrect(oldpassword)

    if (!checkPassword) {
        throw new ApiError(400, "wrong password.")
    }

    user.password = newpassword
    user.save({ validateBeforeSave: false })

    return res
        .status(200)
        .json(
            new ApiResponse(200, {}, "Password change successfully")
        )
})

const changeUserData = asyncHandler(async (req, res) => {

    const { email, userName } = req.body

    if (!(email || userName)) {
        throw new ApiError(400, "details reqiured to change user data.")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                email,
                userName,
            },
        },
        {
            new: true
        }
    ).select("-password -refreshToken")

    return res
        .status(200)
        .json(
            new ApiResponse(200, user, "change user data successfully.")
        )
})

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(400, "refreshToken required.")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )

        const user = await User.findById(decodedToken?._id)

        const {refreshToken, accessToken} = genarateAccessTokenAndRefreshToken(user?._id)

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        const option = {
            httpOnly: true
            
        }

        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json(200, {}, "Access Token genarated successfully.")

    } catch (error) {
        throw new ApiError(400, error?.message || "refresh Token Error.")
    }
})

export {
    registerUser,
    loginUser,
    changeUserData,
    changePassword,
    refreshAccessToken
}