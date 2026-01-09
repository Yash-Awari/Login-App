import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    console.log(req.cookies);
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(404, "Unauthorize error.")
        }

        const decoded = jwt.verify(token,process.env.ACCESS_TOKEN_SECREATE)

        console.log(decoded);

        const user = await User.findById(decoded?._id).select("-password -refreshToken")

        if (!user) {
            throw new ApiError(404, "User not Found.")
        }

        req.user = user
        next();

    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid AccessToken")
    }
})