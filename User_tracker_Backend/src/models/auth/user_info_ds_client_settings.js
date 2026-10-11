const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const user_info_ds_client_settings = sequelize.define(
    "user_info_ds_client_settings",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      user_id: {
        type: DataTypes.BIGINT
      },
      tabs_plateform: { type: Sequelize.JSONB,allowNull: true },
      osa_plateform: { type: Sequelize.JSONB,allowNull: true },
      sos_plateform: { type: Sequelize.JSONB,allowNull: true },
      org_plateform: { type: Sequelize.JSONB,allowNull: true },
      cs_plateform: { type: Sequelize.JSONB,allowNull: true },
      pro_plateform: { type: Sequelize.JSONB,allowNull: true },
      rr_plateform: { type: Sequelize.JSONB,allowNull: true },
      som_plateform: { type: Sequelize.JSONB,allowNull: true },
    },
    {
      tableName: "user_info_ds_client_settings",
      timestamps: false,
    }
  );
  // user_info_ds_client_settings.associate = function (models) {
  //   user_info_ds_client_settings.belongsTo(models.e_genie_client, {
  //     foreignKey: "client_id",
  //     targetKey: "client_id",
  //   });
  //   user_info_ds_client_settings.hasMany(models.users_platforms, { foreignKey: "user_id" });
  //   user_info_ds_client_settings.hasMany(models.users_accounts, { foreignKey: "user_id" });
  // };

  return user_info_ds_client_settings;
};
