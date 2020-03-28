const express = require("express");
const { Router } = require("express");
const Lesson = require("../models/lesson");
const multer = require('multer')
const router = Router();

var cloudinary = require('cloudinary').v2;
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});


const PATH = 'public/images/uploads/lessons';

const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, PATH);
    // },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //         return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    //     }
    // }
});

router.get("/", function(req, res, next){
  Lesson.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

router.put('/update/:id', function(req, res, next){
  const { id } = req.params;
  const { name, date } = req.body;
  let data = {}
  if(name) data.name = name;
  if(date) data.date = date;
  console.log(req.body.name)
  console.log("data ", data)
  Lesson.findByIdAndUpdate(req.params.id, data, {new: true}, (err, result) => {
    if(err){
      console.log("Can't update lesson");
      res.json({code: 500, message: "Can't update lesson"})
    }else{
      console.log("Result >>>>>>>>>>>", result)
      res.json({message: "Updated", code: 200, data: result})
    }
  })
})

router.post("/create", verifyToken ,upload.single('image') , function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      const resp = await cloudinary.uploader.upload(req.file.path, function(error, result){
        if(error){
          return error
        }
        return result
      })
      const { name, date } = req.body;
      if (!name || !date) {
        console.log("Error when getting data fields are empty")
        res.json({message: "Something went wrong", code: 400})
      } else {
        const data = {
          name,
          imageUrl: resp.url,
          date
        }
        Lesson.create({...data}, (err, post) => {
          if (err){
            console.log("Error when videoblog create ", err)
            res.json({message: "Something went wrong", code: 500})
          }else
          res.json({message: "Success", code: 200, data: post});
        });
      }
      }else res.json({code: 401, message: "Access denied"})
  })



})

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.params.id)
  Lesson.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) return next(err)
    res.json({code: 200, data: {post}, message: "Successfully deleted"});
  })
})

module.exports = router
