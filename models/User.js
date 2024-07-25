const mongoose = require("mongoose")
const { stripLow } = require("validator")
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
    verified: {
        type: Boolean,
        default: false
    },
    code: {
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
