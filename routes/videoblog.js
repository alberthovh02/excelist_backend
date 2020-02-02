const express = require("express");
const {Router} = require("express");
const multer = require('multer');
const Videoblog = require("../models/videoblog");
const router = Router();
const PATH = 'public/images/uploads';

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

router.get("/blogs-desc", function(req, res, next) {
	Videoblog.find(function(err, data) {
		if (err) throw new Error(err);
		console.log(res.json(data));
	});
});

router.post("/create", upload.single('image'), function(req, res, next){
  const { language, title, video_link, file_link } = req.body;
	if (!language || !title || !video_link || !file_link) {
		res.json({message: "Something went wrong", code: 500})
		// next();
	} else {
		const data = {
			language,
			title,
			video_link,
			file_link,
			imageUrl: req.file.path
		}
		console.log(">>>>>>>>>>>>>>", data)
		Videoblog.create({...data}, (err, post) => {
			if (err){
				res.json({message: "Something went wrong", code: 500})
			}else
			res.json({message: "Success", code: 200});
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

module.exports = router;
