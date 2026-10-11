const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const ds_save_date_range = sequelize.define(
    "ds_save_date_range",
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },
      startDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: "start_date",
      },
      endDate: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        field: "end_date",
      },
      label: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      ds_client_id: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_by: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: "ds_save_date_range",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["ds_client_id", "label"],
        }
      ]
    }
  );
  // ds_save_date_range.sync({ alter: true });
  

  return ds_save_date_range;
};
