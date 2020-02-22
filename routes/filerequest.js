const express = require("express");
const {Router} = require("express");
const Videoblog = require("../models/videoblog");
const nodemailer = require("nodemailer");

const router = Router();

// router.get("/", function(req, res, next) {
// 	SingleData.find(function(err, lesson) {
// 		if (err) throw new Error(err);
// 		res.json(lesson);
// 	});
// });

router.post("/sendFile", function(req, res, next) {
	const { name, profecion, email, videoLink } = req.body;
  console.log("Videolink>>>>", videoLink)
  Videoblog.find({title: videoLink},function(err, link) {
  		if (err) throw new Error(err);
  		res.json(link);console.log(link.file_link)

	if (!name || !profecion || !email || !videoLink) {
    res.json({code: 400, message: 'empty data'}).code(400)
		next();
	} else {
    const transporter = nodemailer.createTransport({
			service: "gmail",
      port: 465,
      secure: true,
			auth: {
				user: "albert.hovhannisyan.main@gmail.com",
				pass: "alberthovh02"
			}
		});

		const mailOptions = {
			from: "albert.hovhannisyan.main@gmail.com",
			to: "albert.hovhannisyan002@gmail.com",
			subject: "Excelist new message",
			text: `This is your file ${link.file_link}`
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});

	}
  });
});

// router.delete("/:id", function(req, res, next){
//   console.log(">>>>>>>>>>.", req.body)
//   Lesson.findByIdAndRemove(req.body._id,(err, post) => {
//     if(err) return next(err)
//     res.json(post);
//   })
// })

module.exports = router;
