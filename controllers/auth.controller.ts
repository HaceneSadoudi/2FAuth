import { Request, Response, NextFunction } from "express";
import crypto from 'crypto'
import { Prisma } from "@prisma/client";
import { prisma } from "../server";
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

    } catch(error) {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
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
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: error.message
        });
    }
}
