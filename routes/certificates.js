const express = require("express");
const { Router } = require("express");
const Certificates = require("../models/certificates");
const router = Router();

router.get("/", function(req, res, next){
    Certificates.find(function(err, certificate){
        if(err) throw new Error(err);
        res.json(certificate)
    })
});

router.get('/:id', function(req, res, next){
    Certificates.findOne({userId: req.params.id}, (err, data) => {
        if(err) throw new Error(err);
        res.json({code: 200, message: "Success", data})
    })
})

router.put('/:id', function(req, res, next){
    Certificates.findOneAndUpdate(
        {userId: req.params.id},
        {...req.body} ,
        {new:true},
        (err, data) => {
        if(err) {
            res.json({message: `Something went wrong ${err}`, code: 400})
            return false
            next()
        }
        res.json({code: 200, message: "Certificate updated", data})
    })
})

router.post("/create", function(req, res, next){
    const { userCertificates } = req.body;
    if (!userCertificates || !userCertificates.length) {
        res.json({message: "Empty certificate data", code: 400})
    } else {
        userCertificates.forEach(async (certificate) => {
            await Certificates.create({...certificate}, (err, post) => {
                if (err){
                    console.log("Error can't create certificates ", err)
                    // res.json({message: "Error can't create certificates", code: 500});
                    next()
                }
            });
            res.json({message: "Certificates successfully added", code: 200, data: userCertificates});
        })
        // Certificates.create(userCertificates, (err, post, next) => {
        //     if(err) {
        //         console.log("There are error");
        //         res.json({message: "Error can't create certificates", code: 500});
        //         // next()
        //     }
        // })
        // res.json({message: "Certificates successfully added", code: 200, data: Certificates.find({})});
    }
})

router.delete("/:id", function(req, res, next){
    Certificates.findOneAndRemove({userId: req.params.id} ,(err, post) => {
        if(err) res.json({message: "Something went wrong", code: 500});
        else res.json({message: "Success", code: 200, data: post});
    })
})

module.exports = router
