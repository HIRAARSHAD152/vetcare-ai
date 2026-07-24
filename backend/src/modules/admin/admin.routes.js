import express from "express";

import protect from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import {
  getUsers,
  getUser,
  changeUserStatus,
  changeUserRole,
  removeUser,
} from "./admin.controller.js";

const router =
  express.Router();

router.use(
  protect,
  authorizeRoles("admin"),
);

router.get(
  "/users",
  getUsers,
);

router.get(
  "/users/:userId",
  getUser,
);

router.patch(
  "/users/:userId/status",
  changeUserStatus,
);

router.patch(
  "/users/:userId/role",
  changeUserRole,
);

router.delete(
  "/users/:userId",
  removeUser,
);

export default router;