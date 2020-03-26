const express = require("express");
const {Router} = require("express");
const nodemailer = require("nodemailer");
const router = Router();

router.post("/", function(req, res, next) {
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
