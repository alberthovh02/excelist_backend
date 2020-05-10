const express = require("express");
const { Router } = require("express");
const Blogs = require('../models/blogs');
const Videoblogs = require("../models/videoblog");
const Courses = require("../models/course");
const router = Router();

router.get("/:keyword", async function(req, res, next){
    const responseData = []
    console.log("Search query ", req.params.keyword)
    await Blogs.find( { "title": { "$regex": req.params.keyword, "$options": "i" } }, (err, data) => {
        if(err){
            console.log("Something went wrong when finding in blogs")
            return false
        }
        data.length && responseData.push({data, type: "blog"})
    })
    await Videoblogs.find({ "title": { "$regex": req.params.keyword, "$options": "i" } }, (err, data) => {
        if(err){
            console.log("Something went wrong when finding in videoblogs")
            return false
        }
        data.length &&  responseData.push({data, type: "videoblog"})
    })
    await Courses.find({ "title": { "$regex": req.params.keyword, "$options": "i" } }, (err, data) => {
        if(err){
            console.log("Something went wrong when finding in courses")
            return false
        }
       data.length && responseData.push({data, type: "course"})
    })
    res.json({message: "Search finished", code: 200, data: responseData})
})

module.exports = router
