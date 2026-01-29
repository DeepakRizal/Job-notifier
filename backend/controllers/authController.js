import User from "../models/User.js";
import { v4 as uuidv4 } from "uuid";
import { generateAccessToken, generateRefreshToken } from "../utils/token.js";
import bcrypt from "bcryptjs";
import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!confirmPassword) {
    res.status(400).json({
      success: false,
      message: "Please confirm the password",
    });
  }

  if (password !== confirmPassword) {
    res.status(400).json({
      success: false,
      message: "Passwords do not match",
    });
  }

  //finding the user with this gmail
  const user = await User.findOne({ email });

  // checking if the user with this email already exists
  if (user) {
    return res.status(409).json({
      success: false,
      message: "User with this email already exists",
    });
  }

  // checking if the email and password exists or not
  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  // creating the new user
  const newUser = await User.create(req.body);

  newUser.password = undefined;

  //sending the response
  return res.status(201).json({
    success: true,
    user: newUser,
  });
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  //checking if email and password are provided by the user
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // getting the user from the database
  const user = await User.findOne({ email }).select("+password");

  // checking if the user is valid and user is correct
  if (!user || !(await user.comparePassword(password))) {
    return res.status(400).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  const accessToken = generateAccessToken(user._id);

  // generating the token
  const tokenId = uuidv4();
  const refreshToken = generateRefreshToken(user._id, tokenId);

  const tokenHash = await bcrypt.hash(refreshToken, 10);

  await RefreshToken.create({
    userId: user._id,
    tokenHash,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });

  res.status(200).json({ accessToken });
};

export const refreshTokenController = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      error: "Refresh token missing",
    });
  }

  const payload = jwt.verify(
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_SECRET,
  );

  const storedTokens = await RefreshToken.find({
    userId: payload.userId,
    revoked: false,
  });

  const matchedToken = await Promise.any(
    storedTokens.map(async (tokenDoc) => {
      const isMatch = await bcrypt.compare(refreshToken, tokenDoc.tokenHash);
      return isMatch ? tokenDoc : Promise.reject();
    }),
  ).catch(() => null);

  if (!matchedToken) {
    return res.status(403).json({
      error: "Invalid or reused refresh token",
    });
  }

  matchedToken.revoked = true;
  await matchedToken.save();

  const newTokenId = uuidv4();
  const newRefreshToken = generateRefreshToken(payload.userId, newTokenId);
  const newAccessToken = generateAccessToken(payload.userId);

  const hashedRefreshToken = await bcrypt.hash(newRefreshToken, 10);

  await RefreshToken.create({
    userId: payload.userId,
    tokenHash: hashedRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth/refresh",
  });

  return res.status(200).json({
    accessToken: newAccessToken,
  });
};

// logout handler - clears the auth cookie
export const logoutUser = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(204).json({
      message: "Already logged out",
    });
  }

  const tokens = await RefreshToken.find({ revoked: false });

  let tokenRevoked = false;

  for (const token of tokens) {
    const isMatch = await bcrypt.compare(refreshToken, token.tokenHash);

    if (isMatch) {
      token.revoked = true;
      await token.save();
      tokenRevoked = true;
      break;
    }
  }

  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: tokenRevoked
      ? "Logged out successfully"
      : "Refresh token not found or already revoked",
  });
};

// getting the login user
export const getMe = async (req, res, next) => {
  //destructure the user from the request
  const { user } = req;

  //send the user as a response
  res.status(200).json({
    success: true,
    user,
  });
};

//handler for updating the user

export const updateUser = async (req, res, next) => {
  // use find by id and update method and update the user

  const skills = [...req.user.skills, req.body.skill];

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { skills },
    {
      new: true,
    },
  ).select("-password -__v");

  //once the user is updated send the user back in the response

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
};

export const removeSkill = async (req, res) => {
  const toBeRemoved = req.body.skill;

  const skills = req.user.skills.filter((skill) => skill !== toBeRemoved);

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { skills },
    {
      new: true,
    },
  ).select("-password -__v");

  //once the user is updated send the user back in the response

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
};
