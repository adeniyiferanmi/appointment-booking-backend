import authModel from "../model/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res, next) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "email, password and confirmPassword are required",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "password and confirmPassword do not match",
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await authModel.create({
      ...req.body,
      password: hashedPassword,
      confirmPassword: hashedPassword,
    });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "unable to create admin",
      });
    }
    res.status(201).json({
      status: "success",
      message: "Admin registered successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const loginAdmin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {    
    return res.status(400).json({
      status: "error",
      message: "email and password are required",
    });
  }
  try {
    const user = await authModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "invalid email or password",
      });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXP,
    });
    res.status(200).json({
      status: "success",
      message: "Admin logged in successfully",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    next(error);
    res.status(500).json({
      status: "error",
      message: "Internal server error",
      error: error.message,
    });
  }

}

export const verifyToken = async (req, res, next) => {
     let token;
  try {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized, token not found",
    });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await authModel.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Unauthorized, user not found",
    });
  } 
  res.status(200).json({
    status: "success",
    message: "You are authenticated",
    data: user,
  });
 } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "error",
      message: "Unauthorized, invalid token",
    });
  }
 
}