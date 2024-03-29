const { Schema, model, Types } = require("mongoose");

const blogsSchema = new Schema({
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
    },
    created: {
      type: Date,
      default: Date.now
    }
})

module.exports = model('Blogs', blogsSchema)
