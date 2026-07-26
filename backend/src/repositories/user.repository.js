import BaseRepository from "./base.repository.js";
import User from "../models/user.model.js";

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.model
      .findOne({ email: email.toLowerCase() })
      .select("+password");
  }

  async updateLastLogin(userId) {
    return this.model.findByIdAndUpdate(
      userId,
      {
        lastLoginAt: new Date(),
      },
      {
        returnDocument: "after",
      },
    );
  }

async findByIdWithVerificationData(userId) {
  return this.model
    .findById(userId)
    .select(
      "+verificationOtp +verificationOtpExpiresAt",
    );
}

async saveVerificationOtp(
  userId,
  hashedOtp,
  expiresAt,
) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      verificationOtp: hashedOtp,
      verificationOtpExpiresAt: expiresAt,
    },
    {
     returnDocument: "after",
    },
  );
}

async verifyUser(userId) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      isVerified: true,
      $unset: {
        verificationOtp: 1,
        verificationOtpExpiresAt: 1,
      },
    },
    {
     returnDocument: "after",
    },
  );
}

async findByEmailWithVerificationData(email) {
  return this.model
    .findOne({ email: email.toLowerCase() })
    .select(
      "+verificationOtp +verificationOtpExpiresAt",
    );
}

async findByEmailWithResetData(email) {
  return this.model
    .findOne({
      email: email.toLowerCase(),
    })
    .select(
      "+passwordResetOtp +passwordResetOtpExpiresAt",
    );
}

async savePasswordResetOtp(
  userId,
  hashedOtp,
  expiresAt,
) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      passwordResetOtp: hashedOtp,
      passwordResetOtpExpiresAt: expiresAt,
    },
    {
      returnDocument: "after",
    },
  );
}

async clearPasswordResetOtp(userId) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      $unset: {
        passwordResetOtp: 1,
        passwordResetOtpExpiresAt: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );
}

async updatePassword(userId, password) {
  const user = await this.model.findById(userId);

  if (!user) {
    return null;
  }

  user.password = password;

  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpiresAt = undefined;

  return user.save();
}

async saveRefreshToken(userId, refreshToken) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      refreshToken,
    },
    {
      returnDocument: "after",
    },
  );
}

async findByRefreshToken(refreshToken) {
  return this.model
    .findOne({ refreshToken })
    .select("+refreshToken");
}

async clearRefreshToken(userId) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      returnDocument: "after",
    },
  );
}

async updateProfile(userId, updateData) {
  return this.model
    .findByIdAndUpdate(
      userId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    )
    .select("-password -refreshToken");
}

async findByIdWithPassword(userId) {
  return this.model
    .findById(userId)
    .select("+password");
}

async updatePassword(userId, newPassword) {
  const user = await this.model.findById(userId);

  if (!user) {
    return null;
  }

  user.password = newPassword;
  user.refreshToken = undefined;

  return user.save();
}

async deactivateAccount(userId) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      isActive: false,
      refreshToken: undefined,
    },
    {
      returnDocument: "after",
    },
  );
}

async activateAccount(userId) {
  return this.model.findByIdAndUpdate(
    userId,
    {
      isActive: true,
    },
    {
      returnDocument: "after",
    },
  );
}

async findAllUsers({
  page = 1,
  limit = 10,
  search,
  role,
  isActive,
  sortBy = "createdAt",
  sortOrder = "desc",
}) {
  const filter = {};

  if (search) {
    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (role) {
    filter.role = role;
  }

  if (typeof isActive === "boolean") {
    filter.isActive = isActive;
  }

  const allowedSortFields = [
    "createdAt",
    "updatedAt",
    "name",
    "email",
    "lastLoginAt",
  ];

  const safeSortBy =
    allowedSortFields.includes(sortBy)
      ? sortBy
      : "createdAt";

  const safeSortOrder =
    sortOrder === "asc" ? 1 : -1;

  const skip = (page - 1) * limit;

  const [users, total] =
    await Promise.all([
      this.model
        .find(filter)
        .select(
          "-password -refreshToken",
        )
        .sort({
          [safeSortBy]: safeSortOrder,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      this.model.countDocuments(filter),
    ]);

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(
      total / limit,
    ),
  };
}

async updateUserStatus(userId, isActive) {
  return this.model.findByIdAndUpdate(
    userId,
    { isActive },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password -refreshToken");
}

async updateUserRole(userId, role) {
  return this.model.findByIdAndUpdate(
    userId,
    { role },
    {
      returnDocument: "after",
      runValidators: true,
    },
  ).select("-password -refreshToken");
}

async deleteUser(userId) {
  return this.model.findByIdAndDelete(userId);
}

async getDashboardStats() {
  const [
    totalUsers,
    activeUsers,
    inactiveUsers,
    verifiedUsers,
    unverifiedUsers,
    usersByRole,
    recentUsers,
  ] = await Promise.all([
    this.model.countDocuments(),

    this.model.countDocuments({
      isActive: true,
    }),

    this.model.countDocuments({
      isActive: false,
    }),

    this.model.countDocuments({
      isVerified: true,
    }),

    this.model.countDocuments({
      isVerified: false,
    }),

    this.model.aggregate([
      {
        $group: {
          _id: "$role",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          role: "$_id",
          count: 1,
        },
      },
      {
        $sort: {
          role: 1,
        },
      },
    ]),

    this.model
      .find()
      .select(
        "-password -refreshToken",
      )
      .sort({
        createdAt: -1,
      })
      .limit(5)
      .lean(),
  ]);

  return {
    totalUsers,
    activeUsers,
    inactiveUsers,
    verifiedUsers,
    unverifiedUsers,
    usersByRole,
    recentUsers,
  };
}

async getUserRegistrationStats() {
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
    last24HoursUsers,
    last7DaysUsers,
    last30DaysUsers,
  ] = await Promise.all([
    this.model.countDocuments({
      createdAt: {
        $gte: last24Hours,
      },
    }),

    this.model.countDocuments({
      createdAt: {
        $gte: last7Days,
      },
    }),

    this.model.countDocuments({
      createdAt: {
        $gte: last30Days,
      },
    }),
  ]);

  return {
    last24HoursUsers,
    last7DaysUsers,
    last30DaysUsers,
  };
}

}

const userRepository = new UserRepository();

export default userRepository;