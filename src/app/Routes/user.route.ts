import express from "express";

import { isAuthenticated } from "../middleware/isAuthenticate";
import upload from "../middleware/multer";
import { checkAuth, findUser, forgotPassword, login, logout, resetPassword, signup, updateProfile, updateRole } from "../contoller/user.controller";

const router = express.Router();

// Public Routes
router.route("/").get(findUser);
router.route('/role/:id').post(updateRole)
router.route("/signup").post(signup); 
router.route("/login").post(login); 
router.route("/logout").post(logout);

router.route("/forgot-password").post(forgotPassword); 
router.route("/reset-password/:token").post(resetPassword); 


router.route("/check-auth").get(isAuthenticated, checkAuth); 
router
    .route("/profile/update")
    .put(isAuthenticated, upload.single("profilePicture"), updateProfile); 

export const userRoutes = router;
