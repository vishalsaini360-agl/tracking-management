const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const ds_user_customize_columns_save_view = sequelize.define(
    "ds_user_customize_columns_save_view",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      client_id: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      title: { type: DataTypes.STRING },
      kpi: { type: DataTypes.STRING },
      tabName: { type: DataTypes.STRING },
      selectedOptions: { type: Sequelize.JSONB,allowNull: true },
      is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "ds_user_customize_columns_save_view",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["client_id", "title","kpi","tabName"],
        }
      ]
    }
  );
  

  // ds_user_customize_columns_save_view.sync({ alter: true });
  return ds_user_customize_columns_save_view;
};
