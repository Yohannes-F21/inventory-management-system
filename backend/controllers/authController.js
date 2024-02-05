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

const login = async (req, res) => {
    const { email, otp } = req.body

    if (!email || !otp) {
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json({ message: "Please provide email and otp" })
    }

    const user = await UserModel.findOne({ email })

    if (!user) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "No Such User" })
    }

    const otpExists = await OTPModel.findOne({ email })

    if (!otpExists) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "No such OTP sent for this account" })
    }

    if (!bcrypt.compare(otp, otpExists.otp)) {
        return res
            .status(StatusCodes.UNAUTHORIZED)
            .json({ message: "Please Verify with valid OTP" })
    }

    const tokenUser = createTokenUser(user)

    let refreshToken = ""

    const existingToken = await TokenModel.findOne({ user: user._id })

    if (existingToken) {
        const { isValid } = existingToken

        if (!isValid) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "Invalid token" })
        }

        refreshToken = existingToken.refreshToken
        attachCookiesToResponse({ res, user: tokenUser, refreshToken })
        res.status(StatusCodes.OK).json({ user: tokenUser })
        return
    }

    refreshToken = crypto.randomBytes(40).toString("hex")
    const userAgent = req.headers["user-agent"]
    const ip = req.ip
    const userToken = { refreshToken, ip, userAgent, user: user._id }

    await TokenModel.create(userToken)
    attachCookiesToResponse({ res, user: tokenUser, refreshToken })

    res.status(StatusCodes.OK).json({ user: tokenUser })
}

module.exports = {
    sendOTP,
    login,
}
