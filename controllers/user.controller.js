const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")

exports.verifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not logged In . Please Login Again" })
    }
    const otp = Math.floor(10000 + Math.random() * 900000)                      //otp return return change honya sathi
    await User.findByIdAndUpdate(req.loggedInUser, { emailCode: otp })   // ya line ni otp database mdhe jato
    sendEmail({
        to: result.email,
        subject: "Verify Email",
        message: `<p>your otp ${otp}</p>`
    })

    res.json({ message: "verification Send Success" })
})
exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not logged In . Please Login Again" })
    }
    if (otp !== result.emailCode) {
        return res.status(400).json({ message: "Invalid OTP" })

    }
    await User.findByIdAndUpdate(req.loggedInUser, { emailVerified: true })
    res.json({ message: "Email Verify Success" })
})
exports.verifyMobileOTP = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not logged In . Please Login Again" })
    }
    if (otp !== result.mobileCode) {
        return res.status(400).json({ message: "Invalid OTP" })

    }
    await User.findByIdAndUpdate(req.loggedInUser, { MobileVerified: true })
    res.json({ message: "Mobile Verify Success" })
})