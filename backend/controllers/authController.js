import User from "../models/User.js";
import jwt from "jsonwebtoken";

function signToken(id) {
  const token = jwt.sign(
    {
      userId: id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );

  return token;
}

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
      error: "User with this email already exists",
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

export const loginUser = async (req, res, next) => {
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

  // generating the token
  const token = signToken(user._id);

  // removing the password so that it is not included in the response
  user.password = undefined;

  //sending cookie to the response
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
  // lastly sending the response
  res.status(200).json({
    success: true,
    user,
  });
};

// logout handler - clears the auth cookie
export const logoutUser = (req, res, next) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
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
  const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
  }).select("-password -__v");

  //once the user is updated send the user back in the response

  res.status(200).json({
    success: true,
    user: updatedUser,
  });
};
