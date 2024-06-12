import express from 'express'
import authController from '../controllers/auth.controller'

const router = express.Router();

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This route registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the user
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password of the user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: User already exists
 *       400:
 *          description: Bad request
 */
router.post("/login", authController.Login);
router.post("/otp/generate", authController.GenerateOTP)
router.post("/otp/verify", authController.VerifyOTP)
router.post("/otp/validate", authController.ValidateOTP)
router.post("/otp/disable", authController.DisableOTP)

export default router;