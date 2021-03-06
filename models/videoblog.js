const { Schema, model, Types } = require("mongoose");

const videoblogSchema = new Schema({
    language: {
        type: String,
        required: true,
    },
    title: {
      type: String,
      required: true
    },
    video_link: {
        type: String,
        required: true
    },
    file_link: {
      type: String
    },
    language: {
      type: String,
      required: true
    },
    imageUrl: {
      type: String,
      required: true
    },
    generatedUrl: {
      type: String,
      required: true
    },
    isEmpty: {
      type: Boolean,
      default: false 
    },
    created: {
      type: Date,
      default: Date.now
    }
})

module.exports = model('Videoblog', videoblogSchema)
