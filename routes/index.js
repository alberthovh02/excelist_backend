const express = require("express");
const { Router } = require("express");
// const Admin = require("../models/models/admin");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const { check, validationResult } = require('express-validator');
// const User = require("../models/User.js");
const Lesson = require("../models/lesson")
const router = Router();

// router.post("/", async (req, res) => {
//   const { username, password } = req.body;
//
//   const admin = Admin.findOne({ username, password});
//
//   if(!admin){
//     alert("Incorrect data")
//   }else{
//     alert("find")
//   }
//
//
// })

router.get("/", function(req, res, next){
  Lesson.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

router.post("/create", function(req, res, next){
  const { name, endTime } = req.body;

  if(!name || !endTime){
    next()
  }else{
  Lesson.create(req.body, (err, post) => {
    if(err) throw new Error(err);
    res.json({message: "Success", code: 200})
  })
}
})

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.body)
  Lesson.findByIdAndRemove(req.body._id,(err, post) => {
    if(err) return next(err)
    res.json(post);
  })
})

module.exports = router
