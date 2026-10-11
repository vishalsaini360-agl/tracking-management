// const mongoose = require("mongoose");
// const config = require("../../appConfig.json");
// const mode = process.env.MODE;
// const dbConfig = config[mode];
// const tables = require("./../models");

// mongoose.connect(dbConfig.mongo_url, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", function callback() {
// });
// dbConfig.databases.forEach((val) => {
//   db[val.name] = db.useDb(val.db);
//   tables.forEach((table) => {
//     db[val.name][table[0]] = db[val.name].model(...table);
//   });
// });
// mongoose.set("debug", true);
// module.exports = db;
