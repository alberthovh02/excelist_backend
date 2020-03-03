const express = require("express");
const { Router } = require("express");
const multer = require('multer');
const Blogs = require("../models/blogs")
const router = Router();
var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});

const PATH = 'public/images/uploads/blogs';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, PATH);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        console.log('fileee', file)
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
  Blogs.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

router.post("/create", upload.single('image'), async function(req, res, next){
  const { title, content } = req.body;
  const resp = await cloudinary.uploader.upload(req.file.path, function(error, result){
    if(error){
      return error
    }
    return result
  })
  console.log('resp', resp)
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
		Blogs.create({...data}, (err, post) => {
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
  Blogs.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router
