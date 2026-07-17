import jwt from "jsonwebtoken";

import env from "../config/env.js";
import ApiError from "../utils/ApiError.js";
import userRepository from "../repositories/user.repository.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      throw new ApiError(
        401,
        "Authentication required.",
      );
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET,
    );

    const user = await userRepository.findById(
      decoded.userId,
    );

    if (!user) {
      throw new ApiError(
        401,
        "User no longer exists.",
      );
    }

    if (!user.isActive) {
      throw new ApiError(
        403,
        "Your account is inactive.",
      );
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError"
    ) {
      return next(
        new ApiError(
          401,
          "Invalid or expired token.",
        ),
      );
    }

    next(error);
  }
};

export default protect;