const { DataTypes, hasMany } = require("sequelize");
const e_genie_platform_list = require("./e_genie_platform_list");
const e_genie_client = require("./e_genie_client");
module.exports = (sequelize, Sequelize) => {
  const e_genie_platform_mapping = sequelize.define(
    "e_genie_platform_mapping",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      client_id: { type: DataTypes.STRING }, 
      platform_id: { type: DataTypes.STRING }, 
      status: { type: DataTypes.STRING },
    },
    {
      tableName: "e_genie_platform_mapping",
      timestamps: true,
    }
  );
  e_genie_platform_mapping.belongsTo(e_genie_client(sequelize, Sequelize), {
    foreignKey: "client_id",
    targetKey: "client_id",
  });
  e_genie_platform_mapping.belongsTo(e_genie_platform_list(sequelize, Sequelize), {
    foreignKey: "platform_id",
    targetKey: "platform_id",
  });

  return e_genie_platform_mapping;
};