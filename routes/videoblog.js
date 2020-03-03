const express = require("express");
const {Router} = require("express");
const multer = require('multer');
const Videoblog = require("../models/videoblog");
const router = Router();
const cloudinary = require('cloudinary');

const PATH = 'public/images/uploads';

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});

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
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //         return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    //     }
    // }
});

router.get("/blogs-desc", function(req, res, next) {
	Videoblog.find(function(err, data) {
		if (err) throw new Error(err);
		console.log(res.json(data));
	});
});

router.get('/video/:videobloglink', function(req, res, next){
  console.log("PArams ", req.params.videobloglink)
})

router.post("/create", function(req, res, next){

  const upload = multer({storage}).any();
  upload(req, res, function(err){
    if(err){
      console.log('Image upload error ', err)
    }
    const path = req.file.path
    const uniqueFilename = new Date().toISOString()
    cloudinary.uploader.upload(
      path,
      { public_id: `blog/${uniqueFilename}`, tags: `blog` }, // directory and tags are optional
      function(err, image) {
        if (err) return res.send(err)
        console.log('file uploaded to Cloudinary')
        // remove file from server
        const fs = require('fs')
        fs.unlinkSync(path)
        // return image details
        res.json(image)
      }
    )
  })
  console.log('File', req.files)
  const { language, title, video_link } = req.body;
  const generatedUrl = `${title.trim()}_${language}`;
  console.log("GENERATED URL", generatedUrl);
	if (!language || !title || !video_link) {
    console.log("Error when getting data fields are empty")
		res.json({message: "Something went wrong", code: 400})
	} else {
    let data;
    if(req.files[1]){
      data = {
  			language,
  			title,
  			video_link,
  			file_link: req.files[1].path,
  			imageUrl: req.files[0].path,
        generatedUrl
  		}
    }else {
      data = {
        language,
        title,
        video_link,
        imageUrl: req.files[0].path,
        generatedUrl
      }
    }
		Videoblog.create({...data}, (err, post) => {
			if (err){
        console.log("Error when videoblog create ", err)
				res.json({message: "Something went wrong", code: 500})
			}else
			res.json({message: "Success", code: 200, data: post});
		});
  }
})

router.delete("/:id", function(req, res, next){
  Videoblog.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) {
      console.log("Can't delete videoblog error: ", err)
      res.json({message: "Something went wrong", code: 500})
    }
    res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router;
