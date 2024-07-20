// admin register
// admin verify otp
// admi login
// admi logout

// user register
// user verify email
// user login
// user logout

const asyncHandler = require("express-async-handler")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { checkEmpty } = require("../utils/checkEmpty")
const Admin = require("../models/Admin")
const sendEmail = require("../utils/email")

exports.registerAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body
    const { isError, error } = checkEmpty({ name, email, password })
    if (isError) {
        return res.status(400).json({ message: "all  Feilds  Required", error })
    }
    // emai required logic
    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: "Invalid Email" })
    }
    // // strong password
    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json({ message: "Provide Strong Password" })
    // }
    const isFound = await Admin.findOne({ email })
    if (isFound) {
        return res.status(400).json({ message: "email alredy registered with us" })
    }
    const hash = await bcrypt.hash(password, 10)
    await Admin.create({ name, email, password: hash })

    res.json({ message: "Register Success" })
})
exports.loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { isError, error } = checkEmpty({ email, password })
    if (isError) {
        return res.status(401).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: "Email Not Found" })
    }

    const isVerify = await bcrypt.compare(password, result.password)
    if (!isVerify) {
        return res.status(401).json({
            message: process.env.NODE_ENV === "Invalid Password" ?
                "Invalid Password" : "Invalid Creadentials"
        })
    }
    // send OTP
    const otp = Math.floor(10000 + Math.random() * 900000)    //nanoid
    await Admin.findByIdAndUpdate(result._id, { otp })
    await sendEmail({
        to: email, subject: `Login OTP`, message: `<h1>Do Not Share Your Account OTP</h1>
        <p>Your Login Otp ${otp}</p>`
    })
    res.json({ message: "Creadentials Verify Success . OTP send to your register email" })
})
exports.VerifyOTP = asyncHandler(async (req, res) => {
    const { otp, email } = req.body
    const { isError, error } = checkEmpty({ email, otp })
    if (isError) {
        return res.status(401).json({ message: "All Fields required", error })
    }
    if (!validator.isEmail(email)) {
        return res.status(401).json({ message: "Invalid Email" })
    }
    const result = await Admin.findOne({ email })
    if (!result) {
        return res.status(401).json({ message: process.env.NODE_ENV === "development" ? "INVALID PASSWORD" : "Invalid Credentials" })
    }
    if (otp !== result.otp) {
        return res.status(401).json({ message: "invalid OTP" })
    }
    const token = jwt.sign({ userId: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
    res.cookie("admin", token, {
        maxAge: 86400000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    })
    // cookie
    res.json({
        message: "OTP Verify  Success", result: {
            _id: result._id,
            name: result.name,
            email: result.email
        }
    })
})
exports.logoutAdmin = asyncHandler(async (req, res) => {
    res.clearCookie("admin")
    res.json({ message: "Admin Logout Success" })
})
