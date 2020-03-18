const express = require("express");
const {Router} = require("express");
const multer = require('multer');
const Videoblog = require("../models/videoblog");
const router = Router();
const PATH = 'public/images/uploads';

var cloudinary = require('cloudinary').v2;
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});

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

router.get("/blogs-desc", function(req, res, next) {
	Videoblog.find(function(err, data) {
		if (err) throw new Error(err);
		console.log(res.json(data));
	});
});

router.get('/video/:videobloglink', function(req, res, next){
  console.log("PArams ", req.params.videobloglink)
})

router.post("/create",  verifyToken ,upload.any(), function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){

      const resp = await cloudinary.uploader.upload(req.files[0].path,{ resource_type: "auto" }, function(error, result){
        if(error){
          return error
        }
        return result
      })

      const respFile = await cloudinary.uploader.upload(req.files[1].path, function(error, result){
        if(error){
          return error
        }
        return result
      })

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
            file_link: resp.url,
            imageUrl: respFile.url,
            generatedUrl
          }
        }else {
          data = {
            language,
            title,
            video_link,
            imageUrl: respFile.url,
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
      }else res.json({code: 401, message: "Access denied"})
  })






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
