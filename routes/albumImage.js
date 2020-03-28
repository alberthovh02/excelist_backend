const express = require("express");
const { Router } = require("express");
const multer = require('multer');
const Albums = require("../models/albums")
const router = Router();
var cloudinary = require('cloudinary').v2;
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});

const PATH = 'public/images/uploads/albums/image';

const storage = multer.diskStorage({

    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
});

// router.get("/" ,function(req, res, next){
//
//       Albums.find(function(err, lesson){
//         if(err) throw new Error(err);
//         res.json(lesson)
//       })
//   })

router.post("/create/:id", verifyToken ,upload.single('image'),  async function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      const resp = await cloudinary.uploader.upload(req.file.path, function(error, result){
        if(error){
          return error
        }
        return result
      })
      console.log('resp', resp)
      const url = resp.url
    		Albums.findByIdAndUpdate(req.params.id,{ $push: { images: {id: req.params.id,   url} } } ,(err, post) => {
    			if (err){
            console.log("Error when videoblog create ", err)
    				res.json({message: "Something went wrong", code: 500})
    			}else
    			res.json({message: "Success", code: 200, data: post});
    		});

  }

      })
})


router.delete("/delete/:albumId/:imageId", function(req, res, next){
  console.log(">>>>>>>>>>.", req.params)
  Albums.update({_id: req.params.albumId}, {"$pull": {"images": {"id": req.params.imageId}}}, {safe: true, multi: true} ,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})

// router.delete("/:id", function(req, res, next){
//   console.log(">>>>>>>>>>.", req.params)
//   Albums.findByIdAndRemove(req.params.id,(err, post) => {
//     if(err) res.json({message: "Something went wrong", code: 500});
//     else res.json({message: "Success", code: 200, data: post});
//   })
// })


module.exports = router
