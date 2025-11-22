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
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    return res.status(409).json({
      error: "User with this email already exists",
    });
  }

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required",
    });
  }

  const newUser = await User.create(req.body);

  newUser.password = undefined;

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
      error: "Email and password are required",
    });
  }

  // getting the user from the database
  const user = await User.findOne({ email });

  // checking if the user is valid and user is correct
  if (!user || !(await user.comparepassword(password, user.password))) {
    return res.status(400).json({
      error: "Invalid credentials",
    });
  }

  // generating the token
  const token = signToken(user._id);

  // removing the password from the user
  user.password = undefined;

  //sending cookie to the response
  res.cookie("token", token, {
    httpOnly: true,
  });

  // lastly sending the response
  res.status(200).json({
    success: true,
    user,
  });
};
