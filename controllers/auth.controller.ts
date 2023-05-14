import { Request, Response, NextFunction } from "express";
import crypto from 'crypto'
import { Prisma } from "@prisma/client";
import { prisma } from "../server";
import speakeasy from 'speakeasy'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const Register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { name, email, password } = req.body

        await prisma.user.create({
            data: {
                name,
                email,
                password: crypto.createHash("sha256").update(password).digest('hex')
            }
        });

        res.status(201).json({
            status: "success",
            message: "Registered successfully"
        });

    } catch(error: any) {
        if(error instanceof PrismaClientKnownRequestError) {
            if(error.code === "P2002") {
                return res.status(409).json({
                    status: "fail",
                    message: "Email already exist, please try with another email address",
                });
            }
        }
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

const Login = async(
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if(!user) {
            return res.status(404).json({
                status: "fail",
                message: "No user with that email exists"
            });
        }

        res.status(200).json({
            status: "success",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                otp_enabled: user.otp_enabled
            }
        });
    } catch (error: any) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const GenerateOTP = async (req: Request, res: Response) => {
    try {
        const { user_id } = req.body
        const { ascii, hex, base32, otpauth_url } = speakeasy.generateSecret({
            issuer: 'sadoudi2019',
            name: "admin@2fa.com",
            length: 15
        });

        await prisma.user.update({
            where: { id: user_id },
            data: {
                otp_ascii: ascii,
                otp_auth_url: otpauth_url,
                otp_base32: base32,
                otp_hex: hex
            }
        });

        res.status(200).json({
            base32,
            otpauth_url
        });
    } catch(error: any) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}

const VerifyOTP = async (req: Request, res: Response) => {
    try {
        const { user_id, token } = req.body

        const user = await prisma.user.findUnique({ where: { id: user_id } });
        const message = "Token is invalid or usr doesn't exist";
        if(!user) {
            return res.status(401).json({
                status: "fail",
                message
            });
        }

        const verified = speakeasy.totp.verify({
            secret: user.otp_base32!,
            encoding: "base32",
            token,
            
        });

        if(!verified) {
            return res.status(401).json({
                status: "fail",
                message
            })
        }

        const updatedUser = await prisma.user.update({
            where: { id: user_id },
            data: {
                otp_enabled: true,
                otp_verified: true
            }
        });

        res.status(200).json({
            otp_verified: true,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                otp_enabled: updatedUser.otp_enabled
            }
        });

    } catch(error: any) {
        res.status(500).json({
            status: "error",
            message: error.message
        })
    }
}

export default {
    Register,
    Login,
    GenerateOTP,
    VerifyOTP
}