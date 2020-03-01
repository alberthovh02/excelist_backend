const { Schema, model, Types } = require("mongoose");

const commentsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    email: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    parentId: {
      type: String,
      required: true
    },
    parentType: {
      type: String,
      required: true
    }
})

module.exports = model('Comments', commentsSchema)
