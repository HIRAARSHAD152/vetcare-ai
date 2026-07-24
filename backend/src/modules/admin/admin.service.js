import ApiError from "../../utils/ApiError.js";
import userRepository from "../../repositories/user.repository.js";

const getAllUsers = async ({
  page,
  limit,
  search,
  role,
  isActive,
  sortBy,
  sortOrder,
}) => {
  return userRepository.findAllUsers({
    page,
    limit,
    search,
    role,
    isActive,
    sortBy,
    sortOrder,
  });
};

const getUserById = async (userId) => {
  const user =
    await userRepository.findById(
      userId,
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    );
  }

  return user;
};

const updateUserStatus = async (
  userId,
  isActive,
  adminUserId,
) => {
  if (
    userId.toString() ===
    adminUserId.toString()
  ) {
    throw new ApiError(
      400,
      "You cannot change your own account status.",
    );
  }

  const user =
    await userRepository.updateUserStatus(
      userId,
      isActive,
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    );
  }

  return user;
};

const updateUserRole = async (
  userId,
  role,
  adminUserId,
) => {
  if (
    userId.toString() ===
    adminUserId.toString()
  ) {
    throw new ApiError(
      400,
      "You cannot change your own role.",
    );
  }

  const user =
    await userRepository.updateUserRole(
      userId,
      role,
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    );
  }

  return user;
};

const deleteUser = async (
  userId,
  adminUserId,
) => {
  if (
    userId.toString() ===
    adminUserId.toString()
  ) {
    throw new ApiError(
      400,
      "You cannot delete your own account.",
    );
  }

  const user =
    await userRepository.deleteUser(
      userId,
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    );
  }

  return user;
};

export {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
};