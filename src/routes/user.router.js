import { Router } from "express";
import {
    changePassword,
    changeUserData,
    loginUser,
    refreshAccessToken,
    registerUser
} from "../controllers/user.controller";
import { verifyJWT } from "../middleware/auth.middleware";

const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post(verifyJWT, loginUser)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/change-datails").post(verifyJWT, changeUserData)
router.route("/refresh-token").post(refreshAccessToken)

export default router