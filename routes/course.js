const express = require("express");
const { Router } = require("express");
const multer = require('multer');

const Course = require("../models/course")
const router = Router();


const PATH = 'public/images/uploads/course';

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
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
            cb(null, true);
        } else {
            cb(null, false);
            return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
        }
    }
});

router.get("/", function(req, res, next){
  Course.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

router.post("/create", upload.single('image'), function(req, res, next){
  const { title, content } = req.body;
  const generatedUrl = `${title.trim()}`;
  console.log("GENERATED URL", generatedUrl);
	if (!title || !content) {
    console.log("Error when getting data fields are empty")
		res.json({message: "Something went wrong", code: 400})
	} else {
		const data = {
			title,
			imageUrl: req.file.path,
      content,
      generatedUrl
		}
		Course.create({...data}, (err, post) => {
			if (err){
        console.log("Error when videoblog create ", err)
				res.json({message: "Something went wrong", code: 500})
			}else
			res.json({message: "Success", code: 200, data: post});
		});
  }
})

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.params)
  Course.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500})
    else res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router
