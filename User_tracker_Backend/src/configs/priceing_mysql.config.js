const Sequelize = require("sequelize");
const mysql_database = process.env.priceing_mysql_database
const mysql_username = process.env.priceing_mysql_username
const mysql_password = process.env.priceing_mysql_password
const mysql_url = process.env.priceing_mysql_url
const mysql_port = process.env.priceing_mysql_port
const fs = require("fs");
const PriceingDB=mysql_database;
const sequelize = new Sequelize(
  {
    host: mysql_url,
    database: mysql_database,
    dialect: "mysql",
    port: mysql_port,
    logging: true,
    password: mysql_password,
    username: mysql_username
  }
);
sequelize
  .authenticate()  
  .then(() => {
    console.log("Connection has been established successfully MySql."+PriceingDB);
  })
  .catch((error) => {
    console.error("Unable to connect to the database Price: ", error);
  });
sequelize.sync();
const price_mysql_db = {};
price_mysql_db[PriceingDB] = sequelize;
let priceing_mysql_files = fs.readdirSync(__dirname + "/../models/priceing_mysql");
priceing_mysql_files.map((name) => {
  let obj = name.replace(".js", "");
  price_mysql_db[PriceingDB][obj] = require("./../models/priceing_mysql/" + obj)(
    sequelize,
    Sequelize
  );
});

price_mysql_db[PriceingDB].sequelize = sequelize;
Object.keys(price_mysql_db[PriceingDB]).forEach((modelName) => {
  if (price_mysql_db[PriceingDB][modelName].associate) {
    price_mysql_db[PriceingDB][modelName].associate(price_mysql_db[PriceingDB]);
  }
});

price_mysql_db.Sequelize = Sequelize;
price_mysql_db.sequelize = Sequelize;
module.exports = price_mysql_db;


