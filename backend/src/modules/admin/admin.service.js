import ApiError from "../../utils/ApiError.js";
import userRepository from "../../repositories/user.repository.js";
import {   createAuditLog, findAll as findAllAuditLogs , getRecentAuditLogsCount , getAuditActivityStats} from "../../repositories/auditLog.repository.js";

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

await createAuditLog({
actor: adminUserId,
action: "USER_STATUS_UPDATED",
targetUser: userId,
metadata: {
isActive,
},
});

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

await createAuditLog({
actor: adminUserId,
action: "USER_ROLE_UPDATED",
targetUser: userId,
metadata: {
role,
},
});

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

await createAuditLog({
actor: adminUserId,
action: "USER_DELETED",
targetUser: userId,
});

return user;
};

const getAuditLogs = async ({
  page,
  limit,
  action,
}) => {
  return findAllAuditLogs({
    page,
    limit,
    action,
  });
};

const getDashboardStats = async () => {
  const [
    userStats,
    recentAuditLogs,
    userRegistrationStats,
    auditActivityStats,
  ] = await Promise.all([
    userRepository.getDashboardStats(),
    getRecentAuditLogsCount(),
    userRepository.getUserRegistrationStats(),
    getAuditActivityStats(),
  ]);

  return {
    ...userStats,

    userRegistrationStats,

    auditActivityStats,

    recentAuditLogs,
  };
};

export {
  getAllUsers,
  getUserById,
  updateUserStatus,
  updateUserRole,
  deleteUser,
  getAuditLogs,
  getDashboardStats
};