const express = require("express");
const {Router} = require("express");
const Videoblog = require("../models/videoblog");
const nodemailer = require("nodemailer");
const router = Router();

router.post("/sendFile", function(req, res, next) {
	const { name, profecion, email, videoLink } = req.body;
  console.log("Videolink>>>>", videoLink);
	console.log('Email', email)
  Videoblog.findOne({title: videoLink},function(err, link) {
  		if (err) throw new Error(err);
  		res.json(link);console.log(link.file_link)

	if (!name || !profecion || !email || !videoLink) {
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
			to: email,
			subject: "Excelist new message",
			html: `Ահա Ձեր հարցված ֆայլը: ${link.file_link}<br/><div style="color: #0356fc, font-size: 18px">Շնորհակալություն որ հետևում եք մեր ալիքին:<br/><br/>Հարգանքով «Էքսելիստ» ՍՊԸ:<br/><b>Հասցե</b> ք.Երևան Արշակունյաց 2,«Տիգրան Մեծ» հրատ. շենք, 3-րդ հարկ,<br/> <b>Հեռ</b> +374 55 50 57 57,<br/> <b>Կայք</b> www.excelist.am<br/> <b>Ֆեյսբուք</b> www.fb.com/excel.lessons:</div>`
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
			} else {
				console.log("Email sent: " + info.response);
			}
		});

	}
  });
});

module.exports = router;
