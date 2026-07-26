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

const findAll = async ({
  page = 1,
  limit = 10,
  action,
}) => {
  const skip = (page - 1) * limit;

  const filter = {};

  if (action) {
    filter.action = action;
  }

  const [logs, total] = await Promise.all([
    AuditLog.find(filter)
      .populate(
        "actor",
        "name email role",
      )
      .populate(
        "targetUser",
        "name email role",
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    AuditLog.countDocuments(filter),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit,
    ),
  };
};

const getRecentAuditLogsCount = async () => {
  return AuditLog.countDocuments();
};

const getAuditActivityStats = async () => {
  const now = new Date();

  const last24Hours = new Date(
    now.getTime() - 24 * 60 * 60 * 1000,
  );

  const last7Days = new Date(
    now.getTime() - 7 * 24 * 60 * 60 * 1000,
  );

  const last30Days = new Date(
    now.getTime() - 30 * 24 * 60 * 60 * 1000,
  );

  const [
    last24HoursLogs,
    last7DaysLogs,
    last30DaysLogs,
  ] = await Promise.all([
    AuditLog.countDocuments({
      createdAt: {
        $gte: last24Hours,
      },
    }),

    AuditLog.countDocuments({
      createdAt: {
        $gte: last7Days,
      },
    }),

    AuditLog.countDocuments({
      createdAt: {
        $gte: last30Days,
      },
    }),
  ]);

  return {
    last24HoursLogs,
    last7DaysLogs,
    last30DaysLogs,
  };
};

export {
  createAuditLog,
  findByTargetUser,
  findAll,
  getRecentAuditLogsCount,
  getAuditActivityStats
};