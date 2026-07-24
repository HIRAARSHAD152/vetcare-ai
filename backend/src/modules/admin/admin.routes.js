import express from "express";

import protect from "../../middlewares/auth.middleware.js";
import authorizeRoles from "../../middlewares/role.middleware.js";

import validate from "../../middlewares/validate.middleware.js";

import {
  updateUserStatusSchema,
  updateUserRoleSchema,
} from "../../validators/admin.validator.js";

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
  validate(
    updateUserStatusSchema,
  ),
  changeUserStatus,
);

router.patch(
  "/users/:userId/role",
  validate(
    updateUserRoleSchema,
  ),
  changeUserRole,
);

router.delete(
  "/users/:userId",
  removeUser,
);



export default router;