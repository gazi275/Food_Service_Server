import express from "express";
import { checkAuth, findUser, forgotPassword, login, logout, resetPassword, signup, updateProfile, verifyEmail } from "../contoller/user.controller";
import { isAuthenticated } from "../middleware/isAuthenticate";


const router = express.Router();
router.route("/").get(findUser)
router.route("/check-auth").get(isAuthenticated, checkAuth);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").post(logout);
router.route("/verify-email").post(verifyEmail);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/profile/update").put(isAuthenticated,updateProfile);

export const userRoutes = router;