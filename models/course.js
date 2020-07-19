const { Schema, model, Types } = require("mongoose");

const CourseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    imageUrl: {
      type: String,
      required: true
    },
    orderId: {
      type: Number,
      required: true
    },
    generatedUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    captionUrl: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
})

module.exports = model('Course', CourseSchema)
