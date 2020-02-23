const { Schema, model, Types } = require("mongoose");

const singleDataSchema = new Schema({
    students_count: {
        type: Number
    },
    lessons_count: {
      type: Number
    },
    teachers_count:{
      type: Number
    },
    members_count: {
      type: Number
    },
    supporters_count: {
      type: Number
    }
})

module.exports = model('singleData', singleDataSchema)
