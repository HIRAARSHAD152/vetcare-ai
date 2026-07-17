import asyncHandler from "../../utils/asyncHandler.js";
import successResponse from "../../utils/response.js";
import { loginUser, registerUser  , verifyEmail , resendVerificationOtp , forgotPassword, resetPassword, logoutUser , refreshAccessToken , updateProfile , changePassword , deactivateAccount , activateAccount} from "./auth.service.js";
import env from "../../config/env.js";

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

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  const { refreshToken, ...responseData } = result;

  return successResponse(res, {
    statusCode: 200,
    message: "Login successful.",
    data: responseData,
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

const getCurrentUser = asyncHandler(
  async (req, res) => {
    return successResponse(res, {
      message: "Authenticated user fetched successfully.",
      data: {
        user: req.user,
      },
    });
  },
);

const getAdminOnly = asyncHandler(
  async (req, res) => {
    return successResponse(res, {
      message: "Admin-only route accessed successfully.",
      data: {
        user: req.user,
      },
    });
  },
);

const refreshToken = asyncHandler(
  async (req, res) => {
    const currentRefreshToken =
      req.cookies.refreshToken;

    const result = await refreshAccessToken(
      currentRefreshToken,
    );

    res.cookie(
      "refreshToken",
      result.refreshToken,
      {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge:
          30 * 24 * 60 * 60 * 1000,
      },
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Access token refreshed successfully.",
      data: {
        accessToken: result.accessToken,
      },
    });
  },
);

const logout = asyncHandler(
  async (req, res) => {
    const refreshToken =
      req.cookies.refreshToken;

    await logoutUser(refreshToken);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return successResponse(res, {
      statusCode: 200,
      message: "Logged out successfully.",
    });
  },
);

const updateUserProfile = asyncHandler(
  async (req, res) => {
    const user = await updateProfile(
      req.user._id,
      req.body,
    );

    return successResponse(res, {
      statusCode: 200,
      message: "Profile updated successfully.",
      data: {
        user,
      },
    });
  },
);

const changeUserPassword =
  asyncHandler(
    async (req, res) => {
      const user =
        await changePassword(
          req.user._id,
          req.body,
        );

      res.clearCookie(
        "refreshToken",
        {
          httpOnly: true,
          secure:
            env.NODE_ENV ===
            "production",
          sameSite: "strict",
        },
      );

      return successResponse(res, {
        statusCode: 200,
        message:
          "Password changed successfully. Please log in again.",
        data: {
          user,
        },
      });
    },
  );

const deactivateUserAccount =
  asyncHandler(
    async (req, res) => {
      await deactivateAccount(
        req.user._id,
      );

      res.clearCookie(
        "refreshToken",
        {
          httpOnly: true,
          secure:
            env.NODE_ENV ===
            "production",
          sameSite: "strict",
        },
      );

      return successResponse(res, {
        statusCode: 200,
        message:
          "Account deactivated successfully.",
      });
    },
  );

const activateUserAccount =
  asyncHandler(
    async (req, res) => {
      const user =
        await activateAccount(
          req.params.userId,
        );

      return successResponse(res, {
        statusCode: 200,
        message:
          "Account reactivated successfully.",
        data: {
          user,
        },
      });
    },
  );

export { register, login , verify   , resendOtp ,forgotPasswordController, resetPasswordController, getCurrentUser, getAdminOnly, refreshToken, logout  , updateUserProfile , changeUserPassword , deactivateUserAccount , activateUserAccount }; ;