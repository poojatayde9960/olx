const asyncHandler = require("express-async-handler")
const User = require("../models/User")
const sendEmail = require("../utils/email")
const { sendSMS } = require("../utils/sms")
const Post = require("../models/Post")
const { checkEmpty } = require("../utils/checkEmpty")
const upload = require("../utils/upload")

exports.verifyUserEmail = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not logged In . Please Login Again" })
    }
    const otp = Math.floor(10000 + Math.random() * 900000)                //otp return return change honya sathi
    await User.findByIdAndUpdate(req.loggedInUser, { emailCode: otp })   // ya line ni otp database mdhe jato
    sendEmail({
        to: result.email,
        subject: "Verify Email",
        message: `<p>your otp ${otp}</p>`
    })

    res.json({ message: "verification Send Success" })
})
exports.verifyEmailOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body
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
exports.verifyUserMobile = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    const otp = Math.floor(10000 + Math.random() * 900000)
    await User.findByIdAndUpdate(req.loggedInUser, { mobileCode: otp })
    await sendSMS({
        message: ` Wellcome to SKILLHUB . your OTP is${otp}`,
        numbers: `${result.mobile}`
    })
    res.json({ message: "verification Send Success" })
})
exports.verifyMobileOTP = asyncHandler(async (req, res) => {
    const result = await User.findById(req.loggedInUser)
    if (!result) {
        return res.status(401).json({ message: "You are not logged In . Please Login Again" })
    }
    // const otp = Math.floor(10000 + Math.random() * 900000)                      //otp return return change honya sathi

    if (req.body.otp !== result.mobileCode) {
        return res.status(400).json({ message: "Invalid OTP" })

    }

    const updatedUser = await User.findByIdAndUpdate
        (req.loggedInUser,
            { MobileVerified: true },
            { new: true }
        )
    res.json({
        message: "Mobile Verify Success", result: {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            avatar: updatedUser.avatar,
            emailVerified: updatedUser.emailVerified,
            mobileVerified: updatedUser.mobileVerified,


        }
    })
})
exports.getLocation = asyncHandler(async (req, res) => {
    const { gps } = req.body
    const { isError, error } = checkEmpty({ gps })
    if (isError) {
        return res.status(400).json({ message: "all fields Required", error })
    }
    const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${process.env.OPEN_CAGE_API_KEY}=${gps.latitude}%2C
        ${gps.longitude}&pretty=1&no_annotations=1`)
    const x = await response.json()
    res.json({ message: "Location Fetch Success", result: x.results[0].formatted })
})
exports.addPost = asyncHandler(async (req, res) => {
    upload(req, res, async err => {
        const { title, desc, price, location, category } = req.body
        const { error, isError } = checkEmpty({ title, desc, price, location, category })
        if (isError) {
            return res.status(400).json({ message: "all fields Required", error })
        }
        console.log(req.files);


        // await Post.create({ title, desc, price, location, category, user: req.loggedInUser })
        res.json({ message: "post creat success" })
    })
})