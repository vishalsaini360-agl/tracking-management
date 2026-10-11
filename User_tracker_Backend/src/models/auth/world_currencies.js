const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const world_currencies = sequelize.define(
    "world_currencies",
    {
      currency_name: {
        type: DataTypes.STRING,
      },
      currency_code: {
        type: DataTypes.STRING,
      },
      currency_symbol: {
        type: DataTypes.STRING,
      },
      currency_id: {
        type: DataTypes.INTEGER,
      },
      currency_format: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "world_currencies",
      timestamps: false,
    }
  );

  world_currencies.associate = function (models) {
    world_currencies.belongsTo(models.e_genie_client, {
      foreignKey: "currency_id",
      targetKey: "currency_id",
    });
  };
  return world_currencies;
};
