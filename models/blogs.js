const { Schema, model, Types } = require("mongoose");

const blogsSchema = new Schema({
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

module.exports = model('Blogs', blogsSchema)
