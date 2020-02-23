const express = require("express");
const {Router} = require("express");
const router = Router();
const path = require('path');

router.post('/upload', (req, res, next) => {
  if(req.files === null){
    res.status(400).json({message: "Empty data"})
  }

  const file = req.files.file;
  console.log(path.parse(__dirname + '/../').root)
  file.mv(`${path.parse(`../public/images/uploads/photos/${file.name}`).root}`, err => {
    if(err){
      console.error(err);
      return res.status(500).json({message: 'Something went wrong'})
    }
    res.json({ fileName: file.name, filePath: `/uploads/${file.name}`})
  })

})

module.exports = router;
