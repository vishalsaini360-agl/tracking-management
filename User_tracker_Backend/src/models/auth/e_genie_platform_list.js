const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const e_genie_platform_list = sequelize.define(
    "e_genie_platform_list",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      platform_name: { type: DataTypes.STRING }, 
      platform_id: { type: DataTypes.STRING }, 
      status: { type: DataTypes.STRING },
    },
    {
      tableName: "e_genie_platform_list",
      timestamps: true,
    }
  );
  e_genie_platform_list.associate = function (models) {
    e_genie_platform_list.hasMany(models.e_genie_platform_mapping, {
      foreignKey: "platform_id",
      sourceKey: "platform_id",
    });
    e_genie_platform_list.hasMany(models.users_accounts, {
      foreignKey: "platform_id",
      sourceKey: "platform_id"
    });
  };

  return e_genie_platform_list;
};