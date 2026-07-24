import asyncHandler from "../../utils/asyncHandler.js";
import  successResponse from "../../utils/response.js";

import {
  getAllUsers,
  getUserById,
   updateUserStatus,
  updateUserRole,
  deleteUser,
} from "./admin.service.js";

const getUsers = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive,
    } = req.query;

    const result =
      await getAllUsers({
        page: Number(page),
        limit: Number(limit),
        search,
        role,
        isActive:
          isActive === undefined
            ? undefined
            : isActive === "true",
      });

    return successResponse(res, {
      statusCode: 200,
      message: "Users fetched successfully.",
      data: result,
    });
  },
);

const getUser = asyncHandler(
  async (req, res) => {
    const user =
      await getUserById(
        req.params.userId,
      );

    return successResponse(res, {
      statusCode: 200,
      message: "User fetched successfully.",
      data: {
        user,
      },
    });
  },
);

const changeUserStatus = asyncHandler(
  async (req, res) => {
    const { isActive } = req.body;

    const user =
      await updateUserStatus(
        req.params.userId,
        isActive,
      );

    return successResponse(res, {
      statusCode: 200,
      message: isActive
        ? "User activated successfully."
        : "User deactivated successfully.",
      data: {
        user,
      },
    });
  },
);

const changeUserRole = asyncHandler(
  async (req, res) => {
    const { role } = req.body;

    const user =
      await updateUserRole(
        req.params.userId,
        role,
      );

    return successResponse(res, {
      statusCode: 200,
      message: "User role updated successfully.",
      data: {
        user,
      },
    });
  },
);

const removeUser = asyncHandler(
  async (req, res) => {
    await deleteUser(
      req.params.userId,
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User deleted successfully.",
      data: null,
    });
  },
);

export {
  getUsers,
  getUser,
  changeUserStatus,
  changeUserRole,
  removeUser,
};