const express = require("express");
const { Router } = require("express");
const multer = require('multer');
const Albums = require("../models/albums")
const router = Router();
const uniqid = require('uniqid');
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const path = require("path");

const PATH = 'public/uploads/images/albums/';

const storage = multer.diskStorage({
    destination: PATH,
    filename: (req, file, cb) => {
        const fileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
}).single("image");

// router.get("/" ,function(req, res, next){
//
//       Albums.find(function(err, lesson){
//         if(err) throw new Error(err);
//         res.json(lesson)
//       }) 
//   })

router.post("/create/:id", verifyToken,  async function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
        upload(req, res, (err) => {
          if(err){
            res.json({message: "Image not saved something went wrong", code: 500})
          }else{
            const url = `public/uploads/images/albums/${req.file.filename}`
            Albums.findByIdAndUpdate(req.params.id,{ $push: { images: {id: uniqid(), url} } } ,(err, post) => {
              if (err){
                console.log("Error when adding album image ", err)
                res.json({message: "Something went wrong", code: 500})
              }else
                res.json({message: "Success", code: 200, data: post});
            });
          }
        })
    }
  })

})


router.delete("/delete/:albumId/:imageId",async function(req, res, next){
  Albums.findOneAndUpdate({_id: req.params.albumId}, { "$pull": {"images": { "id": req.params.imageId} } }, {new: true}, (err, data) => {
    if(err){
      res.json({message: "Something went wrong when deleting image", code: 500})
    }
    else{
      res.json({message: "Image deleted", code: 200, data: data})
    }
   })
})

module.exports = router
