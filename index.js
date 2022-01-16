const Server = require("./models/server");

const main = async () => {
	const server = new Server();

	server.listen();
};

main();
