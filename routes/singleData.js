const express = require("express");
const {Router} = require("express");
const SingleData = require("../models/singleData");
const router = Router();

router.get("/", function(req, res, next) {
	SingleData.find(function(err, lesson) {
		if (err) throw new Error(err);
		res.json(lesson);
	});
});

router.post("/count", function(req, res, next) {
	const { students_count, lessons_count, teachers_count, members_count } = req.body;
		SingleData.findOneAndUpdate({}, (err, post) => {
			if (err) console.log(err);
			console.log("post", post)
			res.json({message: "Success", code: 200});
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
