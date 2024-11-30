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
        let token = req.cookies?.token; // Check cookies first
        if (!token) {
            const authHeader = req.headers.authorization; // Check Authorization header
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1]; // Extract token from Bearer header
            }
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated (Token missing)",
            });
        }

        // Verify the token
        const decode = jwt.verify(token, process.env.SECRET_KEY!) as jwt.JwtPayload;

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
