const Sequelize = require("sequelize");
const config = require("../../config");
const env = process.env.MODE;
const dbConfig = config[env];
const fs = require("fs");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.mysql_username,
  dbConfig.mysql_password,
  {
    host: dbConfig.mysql_url,
    dialect: "mysql",
    port: dbConfig.mysql_port,
  }
);
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Connection has been established successfully MySql.");
//   })
//   .catch((error) => {
//     console.error("Unable to connect to the database: ", error);
//   });
const mydb = {};

// mydb.Sequelize = Sequelize;
// mydb.sequelize = sequelize;

// mydb.ebux_screencode = require("./../models/mysql/ebux_screencode")(
//   sequelize,
//   Sequelize
// );

// mydb.users = require("./../models/mysql/users")(sequelize, Sequelize);
// mydb.e_genie_client = require("./../models/mysql/e_genie_client")(
//   sequelize,
//   Sequelize
// );

module.exports = mydb;




let databases = dbConfig?.mysql_databases || [];
const mysqldb = [];
databases.map((db) => {
  const sequelize = new Sequelize({
    host: db.mysql_url,
    database: db.mysql_database,
    dialect: "mysql",
    port: db.mysql_port,
    logging: true,
    password: db.mysql_password,
    username: db.mysql_user,
    // dialectOptions: {
    //   ssl: {
    //     require: true,
    //     rejectUnauthorized: false,
    //   },
    // },
  });
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Connection has been established successfully mysql." +
          db.mysql_database
      );
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });

    mysqldb[db.mysql_database] = sequelize;
    mysqldb[db.mysql_database].sequelize = sequelize;

});
mysqldb.Sequelize = Sequelize;
mysqldb.sequelize = Sequelize;

module.exports = mysqldb;
