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
