const express = require("express");
const { Router } = require("express");
const Lesson = require("../models/lesson");
const multer = require('multer')
const router = Router();
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const PATH = 'public/uploads/images/lessons';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
});

router.get("/", function(req, res, next){
  Lesson.find(function(err, lessons){
    if(err) throw new Error(err);
    lessons = lessons.filter((lesson) => new Date(lesson.date) >= new Date(Date.now()))
    lessons = lessons.sort((a, b) => new Date(a.date) - new Date(b.date))
    res.json(lessons)
  })
})

router.put('/update/:id', function(req, res, next){
  const { id } = req.params;
  const { name, date } = req.body;
  let data = {}
  if(name) data.name = name;
  if(date) data.date = date;
  Lesson.findByIdAndUpdate(id, data, {new: true}, (err, result) => {
    if(err){
      res.json({code: 500, message: "Can't update lesson"})
    }else{
        res.json({message: "Updated", code: 200, data: result})
    }
  })
})

router.post("/create",upload.single('image') ,verifyToken , function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      const { name, date, lessonId } = req.body;
      if (!name || !date || !lessonId) {
        console.log("Error when getting data fields are empty")
        res.json({message: "Something went wrong", code: 400})
      } else {
        const data = {
          name,
          lessonId,
          date
        }
        Lesson.create({...data}, (err, post) => {
          if (err){
            res.json({message: "Something went wrong", code: 500})
          }else
          res.json({message: "Success", code: 200, data: post});
        });
      }
      }else res.json({code: 401, message: "Access denied"})
  })



})

router.delete("/:id", function(req, res, next){
  Lesson.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) return next(err)
    res.json({code: 200, data: {post}, message: "Successfully deleted"});
  })
})

module.exports = router
