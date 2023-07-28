const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		const conn = await mongoose.connect(process.env.MONGO_URI);
		console.info(
			`MongoDB connected:`,
			`${conn.connection.host}`.cyan.underline,
			`\nMongo Atlas:`,
			`https://cloud.mongodb.com/`.yellow.bold
		);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
};

module.exports = connectDB;
