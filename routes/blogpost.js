const express = require("express");
const { Router } = require("express");
const Blogs = require("../models/blogs")
const router = Router();

router.get("/:url", function(req, res, next){
  Blogs.findOne({'generatedUrl': req.params.url}, function(err, post){
    if(err) throw new Error(err);
    res.json(post)
  })
})

module.exports = router
