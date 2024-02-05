const { UserModel } = require("../../models/User.model");
const { TokenModel } = require("../../models/Token.model");
const { OTPModel } = require("../../models/OTP.model");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require("axios");
const {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} = require("../../utils/");

let generator = require("generate-password");

const origin = "http://localhost:3000";

const register = async (req, res) => {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  const { token, email, name, mobile, gender, age, role } = req.body;
  try {
    const response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LcWdU8pAAAAAACjGfKHyYwhbXbXVITsjEdTnXNP&response=${token}`
    );

    if (!response.data.success) {
      return res
        .status(500)
        .send({ message: "Error Verifying Captcha.", success: false });
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    const verificationToken = crypto.randomBytes(40).toString("hex");

    const user = await UserModel.create({
      email,
      password,
      name,
      verificationToken,
      mobile,
      gender,
      age,
      role,
    });

    if (role === "student") {
      const { studentID, section, department, year } = req.body;
      const studentData = await StudentDataModel.create({
        studentID,
        section,
        department,
        year,
        userId: user._id,
      });
    }
    if (role === "teacher") {
      const teacherData = await TeacherDataModel.create({
        userId: user._id,
        course: [],
        isAdmin: false,
      });
    }

    await sendVerificationEmail({
      name,
      email,
      token: verificationToken,
      origin,
      password,
      role,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message:
        "User created successfully. Please check your email for verification",
    });
  } catch (error) {
    console.log(error);
    res.send({ message: error, success: false });
  }
};

const sendOTP = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email and password" });
  }

  const user = await UserModel.findOne({ email });
  console.log(user, "user id");

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Password is Incorrect" });
  }

  if (!user.isVerified) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please verify your email first" });
  }
  console.log("here we are");
  const otpExists = await OTPModel.findOne({ email });

  if (otpExists) {
    await OTPModel.findOneAndDelete({ email });
  }

  const newOTP = new OTPModel({ email });
  console.log(newOTP);

  await newOTP.save();
  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "OTP sent" });
};

const login = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide email and otp" });
  }

  const user = await UserModel.findOne({ email });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User" });
  }

  const otpExists = await OTPModel.findOne({ email });

  if (!otpExists) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No such OTP sent for this account" });
  }

  if (!bcrypt.compare(otp, otpExists.otp)) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Please Verify with valid OTP" });
  }

  const tokenUser = createTokenUser(user);

  let refreshToken = "";

  const existingToken = await TokenModel.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;

    if (!isValid) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Invalid token" });
    }

    refreshToken = existingToken.refreshToken;
    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
    return;
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  const userAgent = req.headers["user-agent"];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await TokenModel.create(userToken);
  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

const verifyEmail = async (req, res) => {
  const { verificationToken, email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Verification Failed" });
  }

  if (user.verificationToken !== verificationToken) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "Verification Failed" });
  }

  user.isVerified = true;
  user.verified = Date.now();
  user.verificationToken = "";

  await user.save();

  res.status(StatusCodes.OK).json({ success: true, message: "Email verified" });
};

const logout = async (req, res) => {
  console.log(req.user._id);
  await TokenModel.findOneAndDelete({ user: req.user._id });
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const id = req.params.userId;

  if (!oldPassword || !newPassword) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "Please provide new and old passwords",
        success: false,
      });
  }

  const user = await UserModel.findOne({ _id: id });

  if (!user) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: "No Such User", success: false });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Old password is incorrect",
    });
  }

  user.password = newPassword;

  await user.save();

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "Password changed successfully" });
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide valid email" });
  }

  const user = await UserModel.findOne({ email });

  if (user) {
    const passwordToken = crypto.randomBytes(70).toString("hex");

    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      token: passwordToken,
      role: user.role,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = passwordTokenExpirationDate;
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link" });
};

const resetPassword = async (req, res) => {
  const { token, email, password } = req.body;
  if (!token || !email || !password) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: "Please provide all fields" });
  }

  const user = await UserModel.findOne({ email });
  console.log(user);

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === token &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      console.log("here");
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.send({ message: "Reset Password successful" });
};

module.exports = {
  register,
  sendOTP,
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  logout,
};
