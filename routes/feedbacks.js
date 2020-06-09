const express = require("express");
const {Router} = require("express");
const multer = require('multer');
const Feedbacks = require("../models/feedbacks");
const router = Router();
const verifyToken = require('../helpers/auth');
const jwt = require('jsonwebtoken');

const PATH = 'public/uploads/images/feedbacks';

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


router.get("/", function(req, res, next) {
	Feedbacks.find(function(err, lesson) {
		if (err) throw new Error(err);
		res.json(lesson);
	});
});

router.post("/create",  verifyToken ,upload.single('image') ,function(req, res, next) {

  jwt.verify(req.token, 'mysecretkey', async(err, authData) => {
    if(!err){
      	const { username, comment, link } = req.body;
      const url = `https://159.65.216.209:3000/public/uploads/images/feedbacks/${req.file.filename}`
      const data = {username, comment, link, imageUrl: url}
  		Feedbacks.create({...data}, (err, post) => {
  			if (err) throw new Error(err);
  			res.json({message: "Success", code: 200, data: post});
  		});
      }else res.json({code: 401, message: "Access denied"})
  })


});

router.put('/:id', function(req, res, next){
    Feedbacks.findByIdAndUpdate(
    req.params.id,
    req.body,
    {new: true},
    (err, feedback) => {
        if (err) return res.status(500).send(err);
        return res.json({message: "Updated", code: 200, data: feedback});
    }
)
})

router.delete("/:id", function(req, res, next){
  Feedbacks.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) return next(err)
    res.json({message: "successfully deleted", code: 200});
  })
})

module.exports = router;
