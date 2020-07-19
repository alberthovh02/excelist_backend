const express = require("express");
const { Router } = require("express");
const multer = require('multer');
const Blogs = require("../models/blogs")
const router = Router();
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');


const PATH = 'public/uploads/images/blogs';

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

router.get("/" ,async function(req, res, next){
      Blogs.find(function(err, lesson){
        if(err) throw new Error(err);
        res.json(lesson)
      })
  })

router.get('/:page', async(req, res, next) => {
    const perPageLimit = 12;
    const page = req.params.page || 1;
    try{
        const pages = await Blogs.count();
        const pageLimitData = await Blogs
            .find({}, null, {sort: {created: -1}})
            .skip((perPageLimit * page) - perPageLimit)
            .limit(perPageLimit)
            .lean()
        pageLimitData.forEach(el => el.pages = pages)
        res.json({message: 'success',  data: [...pageLimitData ] , code: 200 })
    }catch (e) {
        throw new Error(e)
    }
})

router.post("/create", verifyToken ,upload.single('image'),  async function(req, res, next){

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      const { title, content } = req.body;
      const generatedUrl = `${title.trim()}`;
      const url = `/uploads/images/blogs/${req.file.filename}`
    	if (!title || !content) {
    		res.json({message: "Something went wrong", code: 400})
    	} else {
    		const data = {
    			title,
    			imageUrl: url,
          content,
          generatedUrl
    		}
    		Blogs.create({...data}, (err, post) => {
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
  const { title, text } = req.body;
  let data = {};
  if(title) data.title = title;
  if(text) data.text = text

  Blogs.findByIdAndUpdate(req.params.id, data, {new: true}, (err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "success", code: 200, data: post})
  })
})

router.delete("/:id", function(req, res, next){
  Blogs.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) res.json({message: "Something went wrong", code: 500});
    else res.json({message: "Success", code: 200, data: post});
  })
})

module.exports = router
