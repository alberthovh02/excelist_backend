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

let defaultVal = {
  students_count: 0,
  lessons_count: 0,
  teachers_count: 0,
  members_count: 0,
  supporters_count: 0
}

const modelDef  = model('singleData', singleDataSchema)
const def = new modelDef(defaultVal)

def.create(defaultVal, function(err, data){
  console.log("default values added", data)
})

module.exports = model('singleData', singleDataSchema)
