const express = require("express");
const {Router} = require("express");
const nodemailer = require("nodemailer");
const router = Router();

router.post("/sendMessage", function(req, res, next) {
	const { name, email, title ,message } = req.body;
	if (!name || !email || !message) {
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
			from: email || "excelistclub@gmail.com",
			to: 'info@excelist.am',
			subject: title || 'Նոր նամակ կայքից',
			html: `Անուն Ազգանուն: ${name}<br/> Էլ.հասցե: ${email}<br/>Նամակ: ${message}`
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log('err', error)
        res.json({code: 400, message: 'error'})
			} else {
				console.log("Email sent: " + info.response);
        res.json({code: 200, message: 'ok'})
			}
		});

	}

});

module.exports = router;
