const path = require("path");
const url = require("url");

const moment = require("moment");
moment.locale("es");
const express = require("express");

const Mailer = require("../helpers/mailer");
const Indicadores = require("../helpers/axios");

const indicador = new Indicadores();
const mail = new Mailer();

class Server {
	constructor() {
		this.app = express();
		this.port = 3000;

		this.middlewares();
	}

	middlewares() {
		this.app.use(express.urlencoded({ extended: false }));
		this.app.use(express.json());
		this.app.use(express.static("public"));

		this.app.get("/mailing", (req, res) => {
			const { correos, asunto, contenido } = url.parse(req.url, true).query;

			if (correos.length > 0) {
				if (correos || correos.includes(" ") || correos.includes(",")) {
					let correosReplace = correos.replace(",", "");
					let correosArray = correosReplace.split(" ");
					console.log("CORREOS", correosArray);

					this.emailTemplate().then((apiRes) => {
						mail.send(correosArray, asunto, contenido + apiRes);
						res.redirect("/success.html");
						res.end();
					});
				}
			} else {
				res.redirect("/failure.html");
			}
		});

		this.app.get("*", (req, res) => {
			res.sendFile(path.join(__dirname, "../public", "404.html"));
		});
	}

	async emailTemplate() {
		let template;

		const resp = await indicador.getIndicadores();
		return (template = `
					<p>Hola! Los indicadores económicos de hoy, <strong>${moment().format("LLLL")}</strong>, son los siguientes:</p>
					<ol>
					<li>El valor del <strong>${resp.dolar.nombre}</strong> el día de hoy es: <strong> ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(resp.dolar.valor)}</strong></li>
                    <li>El valor del <strong>${resp.euro.nombre}</strong> el día de hoy es: <strong> ${new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(
			resp.euro.valor
		)}</strong></li>
                    <li>El valor de la <strong>${resp.uf.nombre}</strong> el día de hoy es: <strong> ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(
			resp.uf.valor
		)}</strong></li>
                    <li>El valor de la <strong>${resp.utm.nombre}</strong> el día de hoy es: <strong> ${new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(
			resp.utm.valor
		)}</strong></li>
					</ol>`);
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log(`Server up and listening at http://localhost:${this.port}`);
		});
	}
}

module.exports = Server;
