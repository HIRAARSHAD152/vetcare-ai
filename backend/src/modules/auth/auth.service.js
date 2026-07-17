import ApiError from "../../utils/ApiError.js";
import { generateToken } from "../../utils/jwt.js";
import userRepository from "../../repositories/user.repository.js";
import {   generateOtp,   hashOtp, } from "../../utils/otp.js";
import {  sendVerificationOtpEmail, sendPasswordResetOtpEmail } from "../../services/email.service.js";

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const registerUser = async ({ name, email, password, role }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const existingUser = await userRepository.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already registered.");
  }

  const user = await userRepository.create({
    name,
    email: normalizedEmail,
    password,
    role,
  });

  // Generate OTP for email verification
  const otp = generateOtp();

const hashedOtp = hashOtp(otp);

const expiresAt = new Date(
  Date.now() + 10 * 60 * 1000,
);

await userRepository.saveVerificationOtp(
  user._id,
  hashedOtp,
  expiresAt,
);

await userRepository.saveVerificationOtp(
  user._id,
  hashedOtp,
  expiresAt,
);

await sendVerificationOtpEmail({
  email: user.email,
  name: user.name,
  otp,
});

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    email: user.email,
    message: "Verification OTP sent to your email.",
  };
};

const loginUser = async ({ email, password }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userRepository.findByEmail(normalizedEmail);

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account is inactive.");
  }

  if (!user.isVerified) {
  throw new ApiError(
    403,
    "Please verify your email before logging in.",
  );
}

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const updatedUser = await userRepository.updateLastLogin(user._id);

  const token = generateToken({
    userId: user._id.toString(),
    role: user.role,
  });

  return {
    user: sanitizeUser(updatedUser),
    token,
  };
};

const verifyEmail = async ({ email, otp }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user = await userRepository.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new ApiError(404, "User not found.");
  }

  const verificationUser =
    await userRepository.findByIdWithVerificationData(
      user._id,
    );

  if (
    !verificationUser.verificationOtp ||
    !verificationUser.verificationOtpExpiresAt
  ) {
    throw new ApiError(
      400,
      "Verification OTP not found.",
    );
  }

  if (
    verificationUser.verificationOtpExpiresAt <
    new Date()
  ) {
    throw new ApiError(
      400,
      "Verification OTP has expired.",
    );
  }

  const hashedOtp = hashOtp(otp);

  if (
    hashedOtp !== verificationUser.verificationOtp
  ) {
    throw new ApiError(
      400,
      "Invalid verification OTP.",
    );
  }

  await userRepository.verifyUser(user._id);

  return {
    email: user.email,
  };
};

const resendVerificationOtp = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user =
    await userRepository.findByEmailWithVerificationData(
      normalizedEmail,
    );

  if (!user) {
    throw new ApiError(
      404,
      "User not found.",
    );
  }

  if (user.isVerified) {
    throw new ApiError(
      400,
      "Email is already verified.",
    );
  }

  const otp = generateOtp();

  const hashedOtp = hashOtp(otp);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  );

  await userRepository.saveVerificationOtp(
    user._id,
    hashedOtp,
    expiresAt,
  );

  await sendVerificationOtpEmail({
    email: user.email,
    name: user.name,
    otp,
  });

  return {
    email: user.email,
  };
};

const forgotPassword = async ({ email }) => {
  const normalizedEmail = email.toLowerCase().trim();

  const user =
    await userRepository.findByEmailWithResetData(
      normalizedEmail,
    );

  if (!user) {
    throw new ApiError(
      404,
      "No account found with this email.",
    );
  }

  const otp = generateOtp();

  const hashedOtp = hashOtp(otp);

  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000,
  );

  await userRepository.savePasswordResetOtp(
    user._id,
    hashedOtp,
    expiresAt,
  );

  await sendPasswordResetOtpEmail({
    email: user.email,
    name: user.name,
    otp,
  });

  return {
    email: user.email,
  };
};

export { registerUser, loginUser , verifyEmail, resendVerificationOtp, forgotPassword  };