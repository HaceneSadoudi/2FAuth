import express from 'express'
import authController from '../controllers/auth.controller'

const router = express.Router();

router.post("/register", authController.Register);
router.post("/login", authController.Login);
router.post("/otp/generate", authController.GenerateOTP)

export default router;