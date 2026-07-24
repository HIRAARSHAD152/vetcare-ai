import AuditLog from "../models/auditLog.model.js";

const createAuditLog = async ({
  actor,
  action,
  targetUser,
  metadata = null,
  ipAddress = null,
  userAgent = null,
}) => {
  return AuditLog.create({
    actor,
    action,
    targetUser,
    metadata,
    ipAddress,
    userAgent,
  });
};

const findByTargetUser = async (targetUser) => {
  return AuditLog.find({
    targetUser,
  })
    .populate(
      "actor",
      "name email role",
    )
    .sort({
      createdAt: -1,
    });
};

export {
  createAuditLog,
  findByTargetUser,
};