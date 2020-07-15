const express = require("express");
const {Router} = require("express");
const multer = require('multer');
const Videoblog = require("../models/videoblog");
const router = Router();
const PATH = 'public/uploads/images/videoblogs';

const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

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

router.get("/blogs-desc", async function(req, res, next) {
  Videoblog.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
});

router.post("/create",  verifyToken ,upload.any(), function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
    const { language, title, video_link, isEmpty } = req.body;
      const changedVideolink = video_link.replace('watch?v=', 'embed/')
      const generatedUrl = `${title.trim()}_${language}`;
      if (!language || !title || !video_link) {
        res.json({message: "Something went wrong", code: 400})
      } else {
        let data;
        if(req.files[1]){
          data = {
            language,
            title,
            video_link: changedVideolink,
            file_link: `public/uploads/images/videoblogs/${req.files[1].filename}`,
            imageUrl: `public/uploads/images/videoblogs/${req.files[0].filename}`,
            generatedUrl
          }
        }else {
          data = {
            language,
            title,
            video_link: changedVideolink,
            imageUrl: `public/uploads/images/videoblogs/${req.files[0].filename}`,
            generatedUrl,
            isEmpty
          }
        }
        Videoblog.create({...data}, (err, post) => {
          if (err){
            res.json({message: "Something went wrong", code: 500})
          }else
          res.json({message: "Success", code: 200, data: post});
        });
      }
      }else res.json({code: 401, message: "Access denied"})
  })

})

router.put("/:id",  verifyToken ,upload.any(), function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
    const { language, title, video_link, isEmpty } = req.body;
      const changedVideolink = video_link ? video_link.replace('watch?v=', 'embed/') : null
      const generatedUrl = title ? `${title.trim()}_${language}` : null ;
        let data = {};
        if(language){
          data.language = language
        }
        if(title){
          data.title = title;
          data.generatedUrl = generatedUrl;
        }
        if(video_link){
          data.video_link = changedVideolink
        }
        if(isEmpty){
          data.isEmpty = isEmpty
        }
        if(req.files[1]){
          data.file_link = `public/uploads/images/videoblogs/${req.files[1].filename}`;
          data.imageUrl = `public/uploads/images/videoblogs/${req.files[0].filename}`
        }if(req.files[0]) {
         data.imageUrl = `public/uploads/images/videoblogs/${req.files[0].filename}`
        }
        Videoblog.findOneAndUpdate({_id: req.params.id},{...data},{new: true}, (err, post) => {
          if (err){
            res.json({message: "Something went wrong", code: 500})
          }else
          res.json({message: "Success", code: 200, data: post});
        });
      }else res.json({code: 401, message: "Access denied"})
  })

})

router.delete("/:id", function(req, res, next){
  Videoblog.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) {
      res.json({message: "Something went wrong", code: 500})
    }
    res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router;
