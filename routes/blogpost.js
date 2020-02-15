const express = require("express");
const { Router } = require("express");
const Blogs = require("../models/blogs")
const router = Router();

router.get("/:url", function(req, res, next){
  console.log("route>>>>>>>>>> ", req.params.url);
  Blogs.findOne({'generatedUrl': req.params.url}, function(err, post){
    if(err) throw new Error(err);
    res.json(post)
  })
})

// router.post("/create", function(req, res, next){
//   const { name, endTime } = req.body;
//
//   if(!name || !endTime){
//     next()
//   }else{
//   Lesson.create(req.body, (err, post) => {
//     if(err) throw new Error(err);
//     res.json({message: "Success", code: 200})
//   })
// }
// })
//
// router.delete("/:id", function(req, res, next){
//   console.log(">>>>>>>>>>.", req.body)
//   Lesson.findByIdAndRemove(req.body._id,(err, post) => {
//     if(err) return next(err)
//     res.json(post);
//   })
// })

module.exports = router
