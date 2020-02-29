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
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //         return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    //     }
    // }
});

router.get("/blogs-desc", function(req, res, next) {
	Videoblog.find(function(err, data) {
		if (err) throw new Error(err);
		console.log(res.json(data));
	});
});

router.get('/video/:videobloglink', function(req, res, next){
  console.log("PArams ", req.params.videobloglink)
})

router.post("/create", upload.any(), function(req, res, next){
  console.log('File', req.files)
  const { language, title, video_link } = req.body;
  const generatedUrl = `${title.trim()}_${language}`;
  console.log("GENERATED URL", generatedUrl);
	if (!language || !title || !video_link) {
    console.log("Error when getting data fields are empty")
		res.json({message: "Something went wrong", code: 400})
	} else {
    let data;
    if(req.files[1]){
      data = {
  			language,
  			title,
  			video_link,
  			file_link: req.files[1].path,
  			imageUrl: req.files[0].path,
        generatedUrl
  		}
    }else {
      data = {
        language,
        title,
        video_link,
        imageUrl: req.files[0].path,
        generatedUrl
      }
    }
		Videoblog.create({...data}, (err, post) => {
			if (err){
        console.log("Error when videoblog create ", err)
				res.json({message: "Something went wrong", code: 500})
			}else
			res.json({message: "Success", code: 200});
		});
  }
})

router.delete("/:id", function(req, res, next){
  console.log("Videoblog delete", req.params)
  Videoblog.findByIdAndRemove(req.params.id,(err, post) => {
    if(err) {
      console.log("Can't delete videoblog error: ", err)
      return next(err)
    }
    res.json({message: "Success", code: 200});
  })
})

module.exports = router;
