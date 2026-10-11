const users = require("./users");
const { DataTypes, HasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const e_genie_client = sequelize.define(
    "e_genie_client",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      client_name: { type: DataTypes.STRING },
      service_started_date: { type: DataTypes.STRING },
      media: { type: DataTypes.STRING },
      db_name: { type: DataTypes.STRING },
      client_id: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      created_at: { type: DataTypes.STRING },
      updated_at: { type: DataTypes.STRING },
    },
    {
      tableName: "e_genie_client",
      timestamps: false,
    }
  );

  return e_genie_client;
};
