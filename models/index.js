const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
// eslint-disable-next-line no-undef
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});

const conn = mongoose.connection;

conn.on('error', (err) => {
    console.log("Mongoose Connection ERROR " + err.message);
});

conn.once('open', () => {
    console.log("MongoDB Connected!");
})

module.exports = conn;