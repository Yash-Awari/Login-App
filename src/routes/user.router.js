import { Router } from "express";
import {
    changePassword,
    changeUserData,
    loginUser,
    mailvarification,
    refreshAccessToken,
    registerUser
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/signup").post(registerUser)
router.route("/login").post( loginUser)
router.route("/change-password").post(verifyJWT, changePassword)
router.route("/change-details").patch(verifyJWT, changeUserData)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/email-verification").get(mailvarification)

export default router