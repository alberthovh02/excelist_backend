const express = require("express");
const {Router} = require("express");
const nodemailer = require("nodemailer");
const router = Router();

router.post("/sendMessage", function(req, res, next) {
	const { name, email, title ,message } = req.body;
	console.log('Email', email)

	if (!name || !email || !message) {
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
			from: email || "albert.hovhannisyan.main@gmail.com",
			to: 'albert.hovhannisyan002@gmail.com',
			subject: title || 'Նոր նամակ կայքից',
			html: `Անուն Ազգանուն: ${name}<br/> Էլ.հասցե: ${email}<br/>Նամակ: ${message}`
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
