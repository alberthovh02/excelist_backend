const { Schema, model, Types } = require("mongoose");

const feedbacksSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    comment: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    created: {
      type: Date,
      default: Date.now
    }
})

module.exports = model('Feedbacks', feedbacksSchema)
