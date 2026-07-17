import { Router } from "express";

import { login, register , verify ,resendOtp , forgotPasswordController, resetPasswordController , getCurrentUser , getAdminOnly , refreshToken, logout } from "./auth.controller.js";

import protect from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js"; 

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verify);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);

router.get(
  "/me",
  protect,
  getCurrentUser,
);

router.get(
  "/admin-only",
  protect,
  authorizeRoles("admin"),
  getAdminOnly,
);

router.post(
  "/refresh-token",
  refreshToken,
);

router.post(
  "/logout",
  logout,
);

export default router;