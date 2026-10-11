const { DataTypes, hasMany } = require("sequelize");
const e_genie_client = require("./e_genie_client");
module.exports = (sequelize, Sequelize) => {
  const users = sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      client_id: { type: DataTypes.STRING },
      ip_address: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      salt: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      activation_code: { type: DataTypes.STRING },
      forgotten_password_code: { type: DataTypes.STRING },
      forgotten_password_time: { type: DataTypes.STRING },
      remember_code: { type: DataTypes.STRING },
      created_on: { type: DataTypes.NUMBER },
      last_login: { type: DataTypes.NUMBER },
      active: { type: DataTypes.NUMBER },
      first_name: { type: DataTypes.STRING },
      last_name: { type: DataTypes.STRING },
      company: { type: DataTypes.STRING },
      phone: { type: DataTypes.NUMBER },
    },
    {
      tableName: "users",
      timestamps: false,
    }
  );

  users.belongsTo(e_genie_client(sequelize, Sequelize), {
    foreignKey: "client_id",
    targetKey: "client_id",
  });
  return users;
};
