const mongoose = require('mongoose');
const HOST = process.env.DB_URL;

(async () => {
    try {
        await mongoose.connect(HOST, {
            dbName: "chat_app",
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: true,
        });
        console.log(`Connected to department database --> host : ${HOST}`);
    } catch (error) {
        console.error(error);
    }
})();

const connection = mongoose.connection;

module.exports = connection;