import express from 'express'
import authController from '../controllers/auth.controller'

const router = express.Router();

router.post("/register", authController.Register);
router.post("/login", authController.Login);
router.post("/otp/generate", authController.GenerateOTP)
router.post("/otp/verify", authController.VerifyOTP)
router.post("/otp/validate", authController.ValidateOTP)
router.post("/otp/disable", authController.DisableOTP)

export default router;