const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const users_accounts = sequelize.define(
    "users_accounts",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: { type: DataTypes.STRING },
      user_id: { type: DataTypes.BIGINT },
      platform_id: { type: DataTypes.STRING },
      account_id: { type: DataTypes.STRING },
      account_name: { type: DataTypes.STRING },
      status: { type: DataTypes.NUMBER },
    },
    {
      tableName: "users_accounts",
      timestamps: false,
    }
  );
  users_accounts.associate = function (models) {
    users_accounts.belongsTo(models.users_platforms, {
      foreignKey: "platform_id",
    });
    // users_accounts.belongsTo(models.e_genie_platform_list, { foreignKey: "platform_id" });
  };

  return users_accounts;
};
