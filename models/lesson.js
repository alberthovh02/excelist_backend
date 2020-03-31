const { Schema, model, Types } = require("mongoose");

const lessonSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    date: {
      type: Date,
      required: true
    },
    lessonId: {
      type: String,
      required: true
    }
})

module.exports = model('Lesson', lessonSchema)
