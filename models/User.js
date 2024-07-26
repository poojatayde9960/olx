const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/dbkyyr68j/image/upload/v1721291360/images_kj9mtg.jpg"

    },
    password: {
        type: String,
        require: true
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    mobileVerified: {
        type: Boolean,
        default: false
    },
    emailCode: {
        type: String,
    },
    mobileCode: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true
    },
    isdeleted: {
        type: Boolean,
        default: false
    },
    mobile: {
        type: Number,
        require: true
    },
}, { timestamps: true })
module.exports = mongoose.model("user", userSchema)
