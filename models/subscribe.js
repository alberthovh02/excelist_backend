const { Schema, model, Types } = require("mongoose");

const subscribeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
      type: String,
      required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Subscribe', subscribeSchema)
