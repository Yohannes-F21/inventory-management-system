const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const { OTPModel } = require("../../models/OTP.model")

const sendOTP = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Please provide email and password" })
    }

    const user = await UserModel.findOne({ email })
    console.log(user, "user id")

    if (!user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "No Such User" })
    }

    const isPasswordCorrect = await user.comparePassword(password)

    if (!isPasswordCorrect) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Password is Incorrect" })
    }

    if (!user.isVerified) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Please verify your email first" })
    }
    console.log("here we are")
    const otpExists = await OTPModel.findOne({ email })

    if (otpExists) {
        await OTPModel.findOneAndDelete({ email })
    }

    const newOTP = new OTPModel({ email })
    console.log(newOTP)

    await newOTP.save()
    return res
        .status(StatusCodes.OK)
        .json({ success: true, message: "OTP sent" })
}

module.exports = {
    sendOTP,
}
