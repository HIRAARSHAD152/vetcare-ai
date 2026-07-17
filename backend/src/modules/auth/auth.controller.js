import asyncHandler from "../../utils/asyncHandler.js";
import successResponse from "../../utils/response.js";
import { loginUser, registerUser  , verifyEmail} from "./auth.service.js";

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

export { register, login , verify };