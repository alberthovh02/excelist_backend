const { Schema, model, Types } = require("mongoose");

const albumsSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
      type: String,
      required: true
    },
    images: {
      type: Array
    }
})

module.exports = model('Albums', albumsSchema)
