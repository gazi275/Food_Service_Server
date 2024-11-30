/* eslint-disable no-unused-vars */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto"; 

import { generateVerificationCode } from "../utils/generateVerificationCode";
import { generateToken } from "../utils/generateToken";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail } from "../mailtrap/email";
import cloudinary from "../utils/cloudinary";
import uploadImageOnCloudinary from "../utils/imageUploads";

export const signup = async (req: Request, res: Response) => {
    try {
      const { fullname, email, password, contact } = req.body;
  
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "User already exists with this email",
        });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const verificationToken = generateVerificationCode();
  
      user = await User.create({
        fullname,
        email,
        password: hashedPassword,
        contact: Number(contact),
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 1 day expiry
      });
  
      const token = generateToken(res, user);
  
      await sendVerificationEmail(email, verificationToken);
  
      const userWithoutPassword = await User.findOne({ email }).select("-password");
      return res.status(201).json({
        success: true,
        message: "Account created successfully",
        token, // Include token in the response
        user: userWithoutPassword,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
    }

    const token = generateToken(res, user);
    user.lastLogin = new Date();
    await user.save();

    const userWithoutPassword = await User.findOne({ email }).select("-password");
    return res.status(200).json({
      success: true,
      message: `Welcome back ${user.fullname}`,
      token, // Include token in the response
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const findUser=async(req:Request,res:Response)=>{
    try {
        // const result=await User.find().select("-password")
        const testUsers = await User.find();
         console.log("Users:", testUsers);
        return res.status(200).json({
            success: true,
            message: 'User retrive successfully',
            user: testUsers
        });
    } catch (error) {
        return res.status(500).json({ message: "User not created" }) 
    }
}

export const logout = async (_: Request, res: Response) => {
    try {
        return res.clearCookie("token").status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
};
export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User doesn't exist"
            });
        }

        const resetToken = crypto.randomBytes(40).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save();

        // send email
        await sendPasswordResetEmail(user.email, `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`);

        return res.status(200).json({
            success: true,
            message: "Password reset link sent to your email"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        const user = await User.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired reset token"
            });
        }
        //update password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        // send success reset email
        await sendResetSuccessEmail(user.email);

        return res.status(200).json({
            success: true,
            message: "Password reset successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const checkAuth = async (req: Request, res: Response) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        };
        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

 // Adjust path as per your file structure


 


export const updateProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.id; // Ensure req.id is set by authentication middleware
    const { fullname, email, address, city, country } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({ message: "Fullname and email are required" });
    }

    let profilePictureUrl: string | undefined;
    if (req.file) {
      try {
        profilePictureUrl = await uploadImageOnCloudinary(req.file);
      } catch (cloudError) {
        console.error("Cloudinary upload error:", cloudError);
        return res.status(500).json({ message: "Failed to upload profile picture" });
      }
    }

    const updatedData: any = { fullname, email, address, city, country };
    if (profilePictureUrl) {
      updatedData.profilePicture = profilePictureUrl;
    }

    const user = await User.findByIdAndUpdate(userId, updatedData, { new: true }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user,
      message: "Profile updated successfully",
    });
  } catch (error: any) {
    console.error("Error in updateProfile:", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};


