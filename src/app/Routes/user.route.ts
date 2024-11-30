import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticate";
import upload from "../middleware/multer";
import { checkAuth, findUser, forgotPassword, login, logout, resetPassword, signup, updateProfile } from "../contoller/user.controller";

const router = express.Router();

// Public Routes
router.route("/").get(findUser); // Retrieve users (ensure this is for admin use or restrict it later)
router.route("/signup").post(signup); // User signup
router.route("/login").post(login); // User login
router.route("/logout").post(logout); // User logout
 // Email verification
router.route("/forgot-password").post(forgotPassword); // Forgot password
router.route("/reset-password/:token").post(resetPassword); // Reset password using token

// Protected Routes (require authentication)
router.route("/check-auth").get(isAuthenticated, checkAuth); // Check if user is authenticated
router
    .route("/profile/update")
    .put(isAuthenticated, upload.single("profilePicture"), updateProfile); // Update user profile

export const userRoutes = router;
