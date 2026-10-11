const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const users_info = sequelize.define(
    "users_info",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: { type: DataTypes.STRING },
      ip_address: { type: DataTypes.STRING },
      username: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      activation_code: { type: DataTypes.STRING },
      created_at: { type: DataTypes.STRING },
      created_by: { type: DataTypes.STRING },
      updated_by: { type: DataTypes.STRING },
      updated_at: { type: DataTypes.STRING },
      last_login: { type: DataTypes.STRING },
      is_verified: { type: DataTypes.INTEGER },
      status: { type: DataTypes.INTEGER },
      role: { type: DataTypes.STRING },
      token_validation_key: { type: DataTypes.STRING },
      tabs_plateform: { type: Sequelize.JSONB,allowNull: true },
      osa_plateform: { type: Sequelize.JSONB,allowNull: true },
      sos_plateform: { type: Sequelize.JSONB,allowNull: true },
      org_plateform: { type: Sequelize.JSONB,allowNull: true },
      cs_plateform: { type: Sequelize.JSONB,allowNull: true },
      pro_plateform: { type: Sequelize.JSONB,allowNull: true },
      rr_plateform: { type: Sequelize.JSONB,allowNull: true },
      sod_plateform: { type: Sequelize.JSONB,allowNull: true },
    },
    {
      tableName: "users_info",
      timestamps: false,
    }
  );
  users_info.associate = function (models) {
    users_info.belongsTo(models.e_genie_client, {
      foreignKey: "client_id",
      targetKey: "client_id",
    });
    users_info.hasMany(models.users_platforms, { foreignKey: "user_id" });
    users_info.hasMany(models.users_accounts, { foreignKey: "user_id" });
  };

  return users_info;
};
