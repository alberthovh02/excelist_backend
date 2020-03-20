const express = require("express");
const { Router } = require("express");
const multer = require('multer');
var cloudinary = require('cloudinary').v2;
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});

const Course = require("../models/course")
const router = Router();


const PATH = 'public/images/uploads/course';

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
  Course.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

router.post("/create", verifyToken ,upload.any(),  async function(req, res, next){
  const { title, content } = req.body;
  const generatedUrl = `${title.trim()}`;

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      console.log('Course ', req.files)
      const resp = await cloudinary.uploader.upload(req.files[0].path, function(error, result){
        if(error){
          return error
        }
        return result
      })
      const respCaption = await cloudinary.uploader.upload(req.files[1].path, function(error, result){
        if(error){
          return error
        }
        return result
      })

      if (!title || !content) {
        console.log("Error when getting data fields are empty")
    		res.json({message: "Something went wrong", code: 400})
    	} else {
    		const data = {
    			title,
          imageUrl: resp.url,
          captionUrl: respCaption.url,
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

  }

      })
})

// router.post("/create", upload.single('image'), function(req, res, next){
//   const { title, content } = req.body;
//   const generatedUrl = `${title.trim()}`;
// 	if (!title || !content) {
//     console.log("Error when getting data fields are empty")
// 		res.json({message: "Something went wrong", code: 400})
// 	} else {
// 		const data = {
// 			title,
// 			imageUrl: req.file.path,
//       content,
//       generatedUrl
// 		}
// 		Course.create({...data}, (err, post) => {
// 			if (err){
//         console.log("Error when videoblog create ", err)
// 				res.json({message: "Something went wrong", code: 500})
// 			}else
// 			res.json({message: "Success", code: 200, data: post});
// 		});
//   }
// })

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.params)
  Course.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500})
    else res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router
