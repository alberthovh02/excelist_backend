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
    endTime :{
      type: Date,
      required: true
    },
    endMinutes: {
      type: String,
      required: true
    }
})

module.exports = model('Lesson', lessonSchema)
