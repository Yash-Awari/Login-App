import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(404, "Unauthorize error.")
        }

        const decoded = JsonWebTokenError.verify(token, process.env.ACCESS_TOKEN_SECREATE)

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