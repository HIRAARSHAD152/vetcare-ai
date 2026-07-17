import asyncHandler from "../../utils/asyncHandler.js";
import successResponse from "../../utils/response.js";
import { loginUser, registerUser  , verifyEmail , resendVerificationOtp , forgotPassword, resetPassword,} from "./auth.service.js";

const register = asyncHandler(async (req, res) => {
  const result = await registerUser(req.body);

  return successResponse(res, {
    statusCode: 201,
    message: "User registered successfully.",
    data: result,
  });
});

const login = asyncHandler(async (req, res) => {
  const result = await loginUser(req.body);

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful.",
    data: result,
  });
});

const verify = asyncHandler(async (req, res) => {
  const result = await verifyEmail(req.body);

  return successResponse(res, {
    message: "Email verified successfully.",
    data: result,
  });
});

const resendOtp = asyncHandler(async (req, res) => {
  const result = await resendVerificationOtp(
    req.body,
  );

  return successResponse(res, {
    message: "A new verification OTP has been sent.",
    data: result,
  });
});

const forgotPasswordController = asyncHandler(
  async (req, res) => {
    const result = await forgotPassword(req.body);

    return successResponse(res, {
      message:
        "Password reset OTP has been sent to your email.",
      data: result,
    });
  },
);

const resetPasswordController = asyncHandler(
  async (req, res) => {
    const result = await resetPassword(req.body);

    return successResponse(res, {
      message: "Password reset successfully.",
      data: result,
    });
  },
);
export { register, login , verify   , resendOtp ,forgotPasswordController, resetPasswordController};