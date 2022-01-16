const axios = require("axios");

class Indicadores {
	constructor() {}

	async getIndicadores() {
		const instance = axios.create({
			baseURL: "https://mindicador.cl/api/",
		});

		const { data } = await instance.get();
		return data;
	}
}

module.exports = Indicadores;
