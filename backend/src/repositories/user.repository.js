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

}

const userRepository = new UserRepository();

export default userRepository;