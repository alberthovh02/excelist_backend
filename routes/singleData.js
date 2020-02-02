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
	const { count, dataType } = req.body;
	if (!count || !dataType) {
		next();
	} else {
		SingleData.create(req.body, (err, post) => {
			if (err) throw new Error(err);
			res.json({message: "Success", code: 200});
		});

	}
});

// router.delete("/:id", function(req, res, next){
//   console.log(">>>>>>>>>>.", req.body)
//   Lesson.findByIdAndRemove(req.body._id,(err, post) => {
//     if(err) return next(err)
//     res.json(post);
//   })
// })

module.exports = router;
