const Sequelize = require("sequelize");
const config = require("../../config");
const env = process.env.MODE;
const dbConfig = config[env];
const fs = require("fs");
let databases = dbConfig?.databases || [];
const psdb = [];
databases.map((db) => {
  const sequelize = new Sequelize({
    host: db.pgsql_url,
    database: db.pgsql_database,
    dialect: "postgres",
    port: db.pgsql_port,
    logging: true,
    password: db.pgsql_password,
    username: db.pgsql_user,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
  sequelize
    .authenticate()
    .then(() => {
      console.info(
        "Connection has been established successfully postgres." +
          db.pgsql_database
      );
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });

  let files = fs.readdirSync(__dirname + "/../models/psql");
  let authfiles = fs.readdirSync(__dirname + "/../models/auth");
  psdb[db.pgsql_database] = sequelize;
  files.map((name) => {
    let obj = name.replace(".js", "");
    psdb[db.pgsql_database][obj] = require("./../models/psql/" + obj)(
      sequelize,
      Sequelize
    );
  });

  authfiles.map((name) => {
    let obj = name.replace(".js", "");
    psdb[db.pgsql_database][obj] = require("./../models/auth/" + obj)(
      sequelize,
      Sequelize
    );
  });

  psdb[db.pgsql_database].sequelize = sequelize;
  Object.keys(psdb[db.pgsql_database]).forEach((modelName) => {
    if (psdb[db.pgsql_database][modelName].associate) {
      psdb[db.pgsql_database][modelName].associate(psdb[db.pgsql_database]);
    }
  });
});
psdb.Sequelize = Sequelize;
psdb.sequelize = Sequelize;

module.exports = psdb;
