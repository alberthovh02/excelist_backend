const express = require("express");
const { Router } = require("express");
const Lesson = require("../models/lesson");
const multer = require('multer')
const router = Router();

const PATH = 'public/images/uploads/lessons';

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

router.get("/", function(req, res, next){
  Lesson.find(function(err, lesson){
    if(err) throw new Error(err);
    res.json(lesson)
  })
})

// router.post("/create", function(req, res, next){
//   const { name, endTime, endMinutes, image } = req.body;
//   console.log(name, endTime, endMinutes, image)
//   console.log('req body>>>>>>>>>', req.body)
//   if(!name || !endTime || !endMinutes || !image){
//     res.json({message: "Empty data", code: 400})
//     next()
//   }else{
//   Lesson.create(req.body, (err, post) => {
//     if(err) throw new Error(err);
//     res.json({message: "Success", code: 200})
//   })
// }
// })

router.post("/create", upload.single('image'), function(req, res, next){
  const { name, date } = req.body;
	if (!name || !endMinutes || !endTime) {
    console.log("Error when getting data fields are empty")
		res.json({message: "Something went wrong", code: 400})
	} else {
		const data = {
			name,
			imageUrl: req.file.path,
      date
		}
		Lesson.create({...data}, (err, post) => {
			if (err){
        console.log("Error when videoblog create ", err)
				res.json({message: "Something went wrong", code: 500})
			}else
			res.json({message: "Success", code: 200, data: post});
		});
  }
})

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.body)
  Lesson.findByIdAndRemove(req.body._id,(err, post) => {
    if(err) return next(err)
    res.json(post);
  })
})

module.exports = router
