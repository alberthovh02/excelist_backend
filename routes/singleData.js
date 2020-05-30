const express = require("express");
const { Router } = require("express");
const SingleData = require("../models/singleData");
const router = Router();

router.get("/", function(req, res, next) {
	SingleData.find(function(err, lesson) {
		if (err) throw new Error(err);
		res.json(lesson);
	});
});

router.post("/count", function(req, res, next) {
	const { 
		students_count, 
		lessons_count, 
		teachers_count, 
		members_count, 
		supporters_count,
		facebook_followers
		 } = req.body;

		let data = {}

		if(students_count) data.students_count = students_count;
		if(lessons_count) data.lessons_count = lessons_count;
		if(teachers_count) data.teachers_count = teachers_count;
		if(members_count) data.members_count = members_count;
		if(supporters_count) data.supporters_count = supporters_count;
		if(facebook_followers) data.facebook_followers = facebook_followers;
		SingleData.findOneAndUpdate({}, data , {new: true, upsert: true}, (err, post) => {
			if (err) console.log(err);
			res.json({message: "Success", code: 200, data: post});
		});
});

module.exports = router;
