const { createJWT, isTokenValid, attachCookiesToResponse } = require("./jwt");
const createTokenUser = require("./createTokenUser");
const sendEmail = require("./sendEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const sendVerificationEmail = require("./sendVerificationEmail");


module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    sendEmail,
    sendResetPasswordEmail,
    sendVerificationEmail
}