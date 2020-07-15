const express = require("express");
const { Router } = require("express");
const multer = require('multer');
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const Course = require("../models/course")
const router = Router();

const PATH = 'public/uploads/images/courses';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg" ||
            file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

router.get("/", async function(req, res, next){
  Course.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

router.get('/:id', function(req, res, next){
    Course.findById(req.params.id, (err, data) => {
        if(err) {
            res.json({message: "Something went wrong", code: 500})
            return false
        }
        res.json({message: "success", data, code: 200})
    })
})

router.post("/create", verifyToken ,upload.any(),  async function(req, res, next){
  const { title, content } = req.body;
  const generatedUrl = `${title.trim()}`;
  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      const url = `public/uploads/images/courses/${req.files[0].filename}`
      const captionUrl = `public/uploads/images/courses/${req.files[1].filename}`

      if (!title || !content) {
    		res.json({message: "Something went wrong", code: 400})
    	} else {
    		const data = {
    			title,
          imageUrl: url,
          captionUrl: captionUrl,
          content,
          generatedUrl
    		}
    		Course.create({...data}, (err, post) => {
    			if (err){
    				res.json({message: "Something went wrong", code: 500})
    			}else
    			res.json({message: "Success", code: 200, data: post});
    		});
      }

  }

      })
})

router.put('/:id', function(req, res, next){
  const { title, text } = req.body;
  let data = {};
  if(title) data.title = title;
  if(text) data.text = text

  Course.findByIdAndUpdate(req.params.id, data, {new: true}, (err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "success", code: 200, data: post})
  })
})

router.put('/orders/:id', (req, res, next) => {
  const { orderId } = req.body;
  Course.findOneAndUpdate({_id: req.params.id}, {orderId: orderId}, { new: true }, (err, data) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "success", code: 200, data: data})
  }
)
})

router.delete("/:id", function(req, res, next){
  Course.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500})
    else res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router
