const { Schema, model, Types } = require("mongoose");

const singleDataSchema = new Schema({
    count: {
        type: Number,
        required: true,
    },
    dataType: {
      type: String,
      required: true
    }
})

module.exports = model('singleData', singleDataSchema)
