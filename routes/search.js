const express = require("express");
const { Router } = require("express");
// const multer = require('multer');
// const Comments = require("../models/comments");
const Blogs = require('../models/blogs');
const Videoblogs = require("../models/videoblog");
const Courses = require("../models/course");
const router = Router();

router.get("/:keyword", function(req, res, next){
    console.log("Search query ", req.params.keyword)
    Blogs.find( { "title": { "$regex": req.params.keyword, "$options": "i" } }, (err, data) => {
        res.json(data)
    })
//   Comments.find(function(err, comment){
//     if(err) throw new Error(err);
//     res.json(comment)
//   })
})

// router.post("/create", function(req, res, next){
//   const { name, email, comment, parentId, parentType } = req.body;
// 	if (!name || !email || !comment) {
//     console.log("Error when getting data fields are empty")
// 		res.json({message: "Something went wrong", code: 400})
// 	} else {
// 		const data = {
// 			name,
//       email,
//       comment,
//       parentId,
//       parentType
// 		}
// 		Comments.create({...data}, (err, post) => {
// 			if (err){
//         console.log("Error when videoblog create ", err)
// 				res.json({message: "Something went wrong", code: 500})
// 			}else
// 			res.json({message: "Success", code: 200, data: post});
// 		});
//   }
// })

// router.delete("/:id", function(req, res, next){
//   console.log(">>>>>>>>>>.", req.params)
//   Comments.findByIdAndRemove(req.params.id,(err, post) => {
//     if(err) res.json({message: "Something went wrong", code: 500});
//     else res.json({message: "Success", code: 200, data: post});
//   })
// })

module.exports = router
