const express = require("express");
const {Router} = require("express");
const nodemailer = require("nodemailer");
const router = Router();
const multer = require('multer');

const storage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, PATH);
    // },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //     if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/gif") {
    //         cb(null, true);
    //     } else {
    //         cb(null, false);
    //         return cb(new Error('Allowed only .png, .jpg, .jpeg and .gif'));
    //     }
    // }
});

router.post("/",upload.single('file'), function(req, res, next) {
	const { file } = req.body;
	console.log('File upload', file)

	if (!file) {
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
			to: 'albert.hovhannisyan002@gmail.com',
			subject: "New CV from excelist.am",
			html: `There are new cv waiting for review`,
			attachments: [{
				filename: 'CV file',
				content: file
			}]
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
        res.json({code: 400, message: 'error'}).code(400)
			} else {
				console.log("Email sent: " + info.response);
        res.json({code: 200, message: 'ok'}).code(200)
			}
		});

	}

});

module.exports = router;
