const { Schema, model, Types } = require("mongoose");

const singleDataSchema = new Schema({
    students_count: {
        type: Number,
        default: 0
    },
    lessons_count: {
      type: Number,
      default: 0
    },
    teachers_count:{
      type: Number,
      default: 0
    },
    members_count: {
      type: Number,
      default: 0
    },
    supporters_count: {
      type: Number,
      default: 0
    }
})


module.exports = model('singleData', singleDataSchema)
