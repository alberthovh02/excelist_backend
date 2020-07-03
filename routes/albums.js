const express = require("express");
const { Router } = require("express");
const multer = require('multer');
const Albums = require("../models/albums")
const router = Router();
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');
const path = require("path")

const PATH = 'public/uploads/images/album';

const storage = multer.diskStorage({
  destination: PATH,
  filename: (req, file, cb) => {
      const fileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      cb(null, fileName)
  }
});

const upload = multer({
  storage: storage,
})

router.get("/" ,function(req, res, next){

      Albums.find(function(err, lesson){
        if(err) throw new Error(err);
        res.json(lesson)
      })
  })

router.post("/create", verifyToken, upload.single("image") ,async function(req, res, next){
  console.log("Body", req.body)
  const { name } = req.body;
  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
    	if (!name) {
    		res.json({message: "Something went wrong", code: 400})
    	} else {
        
        const url = `https://excelist.tk:3000/public/uploads/images/album/${req.file.filename}`
    		const data = {
    			name,
    			imageUrl: url,
    		}
    		Albums.create({...data}, (err, post) => {
    			if (err){
    				res.json({message: "Something went wrong", code: 500})
    			}else
    			res.json({message: "Success", code: 200, data: post});
    		});
      }
      }else res.json({code: 401, message: "Access denied"})
  })

})

router.put('/:id', function(req, res, next){
  Albums.findByIdAndUpdate(req.params.id, {name: req.body.name} , {new: true} ,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})

router.delete("/:id", function(req, res, next){
  Albums.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})


module.exports = router
