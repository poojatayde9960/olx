const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")

exports.verifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.logggedInUser)
    const otp = Math.floor(10000 + Math.random() * 900000)    //otp return return change honya sathi
    await User.findByIdAndUpdate(req.logggedInUser, { emailCode: otp })   // ya line ni otp database mdhe jato
    sendEmail({
        to: result.email,
        subject: "Verify Email",
        message: `<p>your otp ${otp}</p>`
    })

    res.json({ message: "verification Send Success" })
})