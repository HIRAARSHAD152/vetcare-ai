import { Router } from "express";

import { login, register , verify ,resendOtp , forgotPasswordController } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verify);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPasswordController);

export default router;