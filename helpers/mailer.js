const fs = require("fs");

const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");

class Mailer {
	correosPath = `./correos/correo-${uuidv4()}.json`;
	constructor() {}

	async send(to, subject, html) {
		let transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "desafiolatamg13@gmail.com",
				pass: "desafiolatam2022*",
			},
		});

		let mailOptions = {
			from: "desafiolatamg13@gmail.com",
			to,
			subject,
			html,
		};

		transporter.sendMail(mailOptions, (err, data) => {
			if (err) console.log(err);
			if (data) console.log("Mailer data:", data);
			this.guardarCorreos(mailOptions.from, to, subject, html);
		});
	}

	guardarCorreos(desde, para, asunto, contenido) {
		const payload = {
			fecha: moment().format("MMMM Do YYYY, h:mm:ss a"),
			desde,
			para,
			asunto,
			contenido,
		};
		fs.writeFileSync(this.correosPath, JSON.stringify(payload));
	}
}

module.exports = Mailer;
