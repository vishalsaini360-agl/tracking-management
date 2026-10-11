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
      db_name: { type: DataTypes.STRING },
      client_id: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING },
      created_at: { type: DataTypes.STRING },
      updated_at: { type: DataTypes.STRING },
      country_id: { type: DataTypes.INTEGER },
      currency_id: { type: DataTypes.INTEGER },
    },
    {
      tableName: "e_genie_client",
      timestamps: false,
    }
  );

  e_genie_client.associate = function (models) {
    e_genie_client.hasMany(models.e_genie_platform_mapping, {
      foreignKey: "client_id",
      sourceKey: "client_id",
    });
    e_genie_client.hasMany(models.users, {
      foreignKey: "client_id",
      sourceKey: "client_id",
    });
    e_genie_client.hasMany(models.world_currencies, {
      foreignKey: "currency_id",
      sourceKey: "currency_id",
    });
  };

  return e_genie_client;
};
