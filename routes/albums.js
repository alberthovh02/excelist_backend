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

const PATH = 'public/images/uploads/albums';

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

router.get("/" ,function(req, res, next){

      Albums.find(function(err, lesson){
        if(err) throw new Error(err);
        res.json(lesson)
      })
  })

router.post("/create", verifyToken ,upload.single('image'),  async function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      const { name } = req.body;
      const resp = await cloudinary.uploader.upload(req.file.path, function(error, result){
        if(error){
          return error
        }
        return result
      })
      console.log('resp', resp)
      // const generatedUrl = `${title.trim()}`;
      // console.log("GENERATED URL", generatedUrl);
    	if (!name) {
        console.log("Error when getting data fields are empty")
    		res.json({message: "Something went wrong", code: 400})
    	} else {
    		const data = {
    			name,
    			imageUrl: resp.url,
    		}
    		Albums.create({...data}, (err, post) => {
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

router.put('/:id', function(req, res, next){
  console.log(">>>>>>>>>>.", req.params)
  Albums.findByIdAndUpdate(req.params.id, {name: req.body.name} , {new: true} ,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.params)
  Albums.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})


module.exports = router
