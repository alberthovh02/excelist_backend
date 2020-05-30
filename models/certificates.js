const { Schema, model, Types } = require("mongoose");

const certificatesSchema = new Schema({
    name_ARM: {
        type: String,
        required: true,
    },
    name_ENG: {
        type: String,
        default: true
    },
    course_ARM: {
        type: String,
        required: true
    },
    course_ENG: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true,
        unique: true
    }

})

module.exports = model('Certificates', certificatesSchema)
