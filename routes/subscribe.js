const express = require("express");
const {Router} = require("express");
const Subscribe = require("../models/subscribe");
const nodemailer = require("nodemailer");
var cloudinary = require('cloudinary').v2;

const multer = require('multer')
const router = Router();

cloudinary.config({
  cloud_name: 'dhlnheh7r',
  api_key: '448993191284242',
  api_secret: 'PZ-GzNd9xU6l4kirB7eKBD2F6Fw'
});

const PATH = 'public/images/uploads/albums/image';

const storage = multer.diskStorage({

    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, fileName)
    }
});

const upload = multer({
    storage: storage,
});

router.get("/", function(req, res, next) {
	Subscribe.find(function(err, lesson) {
		if (err) throw new Error(err);
		res.json(lesson);
	});
});

router.post("/send", function(req, res, next) {
	const { name, email, proficent } = req.body;
	if (!name || !email) {
		next();
	} else {
		Subscribe.create(req.body, (err, post) => {
			if (err) throw new Error(err);
			res.json({message: "Success", code: 200});
		});
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "albert.hovhannisyan.main@gmail.com",
				pass: "alberthovh02"
			}
		});

		const mailOptions = {
			from: "albert.hovhannisyan.main@gmail.com",
			to: email,
			subject: "Excelist ակումբ",
			html: '<div><p>Դուք բաժանորդագրվել էք Excelist ակումբի նորություններին, շնորհակալ ենք մեզ վստահելու համար:</p><div style="margin: 0 auto"><div style="text-align: center"><a href="https://www.facebook.com/Excel.lessons/?fref=ts" target="_blank"><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089443/facebook_d9jfol.png" style="width: 32px; height:32px; margin-right: 10px" /></a><a href="https://www.youtube.com/channel/UCIhWQ4k5FSaXrn8uKuLin7A" target="_blank"><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089466/youtube_wlbgny.png" style="width: 32px; height:32px;margin-right: 10px" /></a><a href="https://www.linkedin.com/company/%D5%A7%D6%84%D5%BD%D5%A5%D5%AC%D5%AB%D5%BD%D5%BF-%D5%A1%D5%AF%D5%B8%D6%82%D5%B4%D5%A2/" target="_blank"><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089450/linkedin_p2mp1z.png" style="width: 32px; height:32px" /></a></div><br/><div style="text-align: center"><p style="color: green">Հարգանքով ՙՙԷքսելիստ՚՚ ՍՊԸ:</p><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089462/transparent_ray9js.png" style="width: 64px; height:40px" /></div></div>'
		};

		transporter.sendMail(mailOptions, function(error, info) {
			if (error) {
				console.log(error);
				res.json({code: 400, message: 'something went wrong'})
			} else {
				console.log("Email sent: " + info.response);
				res.json({code: 200, message: 'empty data'})
			}
		});
	}
});

router.post("/sendMail",upload.single('image'), async function(req, res, next){
	const { text, link } = req.body;
	if(!text || !link) {
		res.json({message: "Empty data", code: 400})
	}else{
		 const resp = await cloudinary.uploader.upload(req.file.path, function(error, result){
        if(error){
          return error
        }
        return result
      })
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "albert.hovhannisyan.main@gmail.com",
				pass: "alberthovh02"
			}
		});

		Subscribe.find(function(err, subscriber) {
			if (err) throw new Error(err);
			// collectUsers(subscriber)
			console.log('resp url>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', resp.url)
			const emailAddresses = subscriber.map(item => item.email);
			const emailAddressesString = emailAddresses.join(",")
			console.log("ADDRESSES <<<<<<<<<<<<<<<<", emailAddressesString)
			// subscriber.forEach((item) => {
				// setTimeout(() => {
					const mailOptions = {
						from: "albert.hovhannisyan.main@gmail.com",
						to: emailAddressesString,
						subject: "Excelist new message",
						html: `<div><p>${text}<p><br/><div style='display: flex;flex-direction:row;justify-content: space-between'><a href="${link}"><img src='${resp.url}'/></a></div><div style="margin: 0 auto"><div style="text-align: center"><a href="https://www.facebook.com/Excel.lessons/?fref=ts" target="_blank"><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089443/facebook_d9jfol.png" style="width: 32px; height:32px; margin-right: 10px" /></a><a href="https://www.youtube.com/channel/UCIhWQ4k5FSaXrn8uKuLin7A" target="_blank"><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089466/youtube_wlbgny.png" style="width: 32px; height:32px;margin-right: 10px" /></a><a href="https://www.linkedin.com/company/%D5%A7%D6%84%D5%BD%D5%A5%D5%AC%D5%AB%D5%BD%D5%BF-%D5%A1%D5%AF%D5%B8%D6%82%D5%B4%D5%A2/" target="_blank"><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089450/linkedin_p2mp1z.png" style="width: 32px; height:32px" /></a></div><br/><div style="text-align: center"><p style="color: green">Հարգանքով ՙՙԷքսելիստ՚՚ ՍՊԸ:</p><img src="https://res.cloudinary.com/dhlnheh7r/image/upload/v1586089462/transparent_ray9js.png" style="width: 64px; height:40px" /></div></div>`
					};
	
					transporter.sendMail(mailOptions, function(error, info) {
						if (error) {
							console.log("Transporter error", error);
							res.json({code: 400, message: `Նամակը չի ուղարկվել տեխ. խնդրի պատճառով`})
						} else {
							console.log("Email sent: " + info.response);
							res.json({code: 200, message: `Նամակը հաջողությամբ ուղարկվել է օգտատերերին`})
							
						}
					});
				// }, 1500)

			// })
		});
	}
})
module.exports = router;
