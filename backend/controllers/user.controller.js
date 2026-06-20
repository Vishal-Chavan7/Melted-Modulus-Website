import User from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

// register User

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(409, "User already exists");
  }

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (!newUser) {
    throw new ApiError(500, "Failed to create user");
  }

  const createdUser = {
    _id: newUser._id,
    name: newUser.name,
    email: newUser.email,
    phone: newUser.phone,
    createdAt: newUser.createdAt,
  };

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User created successfully"));
});

// login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.isBlocked) {
    throw new ApiError(403, "Your account has been blocked");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid email or password");
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
        "Login successful",
      ),
    );
});

// logout user

const logoutUser = asyncHandler(async (req, res) => {
  const user = req.user

  if(!user){
    throw new ApiError(404, "User not found");
  }

  user.refreshToken = undefined;

  await user.save({validateBeforeSave: false})

  res.clearCookie("accessToken", cookieOptions);
  res.clearCookie("refreshToken", cookieOptions);

  return res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

//forgot password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const forgotPasswordToken = crypto.randomBytes(32).toString("hex");
  const forgotPasswordTokenExpiry = Date.now() + 15 * 60 * 1000;

  user.forgotPasswordToken = forgotPasswordToken;
  user.forgotPasswordTokenExpiry = forgotPasswordTokenExpiry;
  await user.save({ validateBeforeSave: false });

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const forgotPasswordUrl = `${frontendUrl}/reset-password?token=${forgotPasswordToken}`;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { resetPasswordUrl: forgotPasswordUrl },
        "Password reset link generated",
      ),
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({ forgotPasswordToken: token });

  if (!user) {
    throw new ApiError(404, "Invalid or expired token");
  }

  if (user.forgotPasswordTokenExpiry < Date.now()) {
    throw new ApiError(404, "Invalid or expired token");
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordTokenExpiry = undefined;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const changeRefreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized: Refresh token missing");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }

  const user = await User.findById(decodedToken?.id);

  if (!user) {
    throw new ApiError(401, "Unauthorized: Invalid session");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(
      403,
      "Forbidden: Refresh token is invalid or has been used",
    );
  }

  const newRefreshToken = user.generateRefreshToken();
  const newAccessToken = user.generateAccessToken();

  user.refreshToken = newRefreshToken;
  await user.save({ validateBeforeSave: false });

  res.cookie("accessToken", newAccessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { accessToken: newAccessToken, refreshToken: newRefreshToken },
        "Refresh token rotated successfully",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User profile fetched successfully"));
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  const user = await User.findById(req.user._id).select("-password -refreshToken");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  user.name = name ?? user.name;
  user.phone = phone ?? user.phone;
  if (address) {
    user.address = {
      ...user.address?.toObject?.(),
      ...address,
    };
  }

  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User profile updated successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  changeRefreshToken,
  getCurrentUser,
  updateUserProfile,
};
