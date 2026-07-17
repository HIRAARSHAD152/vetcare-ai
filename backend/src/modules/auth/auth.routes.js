import { Router } from "express";

import { login, register , verify } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verify);

export default router;