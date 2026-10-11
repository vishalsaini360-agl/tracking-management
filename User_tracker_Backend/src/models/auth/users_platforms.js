const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const users_platforms = sequelize.define(
    "users_platforms",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: { type: DataTypes.STRING },
      user_id: { type: DataTypes.BIGINT },
      platform_id: { type: DataTypes.STRING },
      platform_name: { type: DataTypes.STRING },
      status: { type: DataTypes.INTEGER },
    },
    {
      tableName: "users_platforms",
      timestamps: false,
    }
  );
  users_platforms.associate = function (models) {
    // users_platforms.belongsTo(models.users_info, {
    //   foreignKey: "user_id",
    //   targetKey: "id",
    // });
    users_platforms.hasMany(models.users_accounts, {
      sourceKey: "platform_id",
      foreignKey: "platform_id",
    });
  };
  return users_platforms;
};
