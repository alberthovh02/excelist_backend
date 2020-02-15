const express = require("express");
const {Router} = require("express");
const multer = require('multer');
const Feedbacks = require("../models/feedbacks");
const router = Router();
const PATH = 'public/images/uploads/feedbacks';

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

router.post("/create", upload.single('image') ,function(req, res, next) {
	const { username, comment, link } = req.body;
	if (!username, !comment || !link) {
    console.log("errrrror")
		next();
	} else {
		Feedbacks.create(req.body, (err, post) => {
			if (err) throw new Error(err);
			res.json({message: "Success", code: 200});
		});

	}
});

router.delete("/:id", function(req, res, next){
  console.log(">>>>>>>>>>.", req.params.id)
  Feedbacks.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) return next(err)
    res.json(post);
  })
})

module.exports = router;
