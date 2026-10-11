const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      ip_address: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      platforms: { type: DataTypes.JSON },
      salt: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      activation_code: { type: DataTypes.STRING },
      forgotten_password_code: { type: DataTypes.STRING },
      forgotten_password_time: { type: DataTypes.STRING },
      remember_code: { type: DataTypes.STRING },
      created_on: { type: DataTypes.STRING },
      last_login: { type: DataTypes.STRING },
      active: { type: DataTypes.STRING },
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      company: { type: DataTypes.STRING },
      phone: { type: DataTypes.STRING },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );
  return users;
};
