const express = require("express");
const {Router} = require("express");
const nodemailer = require("nodemailer");
const router = Router();
const multer = require('multer');

const storage = multer.diskStorage({
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
	if (!req.file) {
    res.json({code: 400, message: 'empty data'})
		next();
	} else {
    const transporter = nodemailer.createTransport({
			service: "gmail",
      port: 465,
      secure: true,
			auth: {
				user: "excelistclub@gmail.com",
				pass: "c12768291"
			}
		});

		const mailOptions = {
			from: "excelistclub@gmail.com",
			to: 'info@excelist.am',
			subject: "New CV from excelist.am",
			html: `There are new cv waiting for review`,
			attachments: [{
				filename: req.file.originalname,
				content: req.file
			}]
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
        res.json({code: 400, message: 'error'}).code(400)
			} else {
				console.log("Email sent: " + info.response);
        res.json({code: 200, message: 'ok'}).code(200)
			}
		});

	}

});

module.exports = router;
