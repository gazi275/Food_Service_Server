/* eslint-disable @typescript-eslint/no-namespace */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            id: string;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Log cookies for debugging
        console.log("Cookies received:", req.cookies);

        const token = req.cookies?.token; // Use optional chaining to avoid undefined errors
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated (Token missing)",
            });
        }

        console.log("Token received:", token); // Debugging the token

        // Verify the token
        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;
        console.log("Decoded token:", decode); // Debug decoded payload

        if (!decode || !decode.userId) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or missing userId",
            });
        }

        req.id = decode.userId; // Attach user ID for subsequent use
        next(); // Proceed to the next middleware/controller
    } catch (error: any) {
        console.error("JWT Verification Error:", error.message);
        return res.status(500).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};
