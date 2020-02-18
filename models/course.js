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
    generatedUrl: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    }
})

module.exports = model('Course', CourseSchema)
