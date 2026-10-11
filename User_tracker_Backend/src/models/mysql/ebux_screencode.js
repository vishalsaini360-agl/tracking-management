const { DataTypes, INTEGER, DATE } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const ebux_screencode = sequelize.define(
    "ebux_screencode",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      screencode: { type: DataTypes.STRING },
      user_id: { type: DataTypes.STRING },
      password: { type: DataTypes.STRING },
      status: { type: INTEGER, default: 1 },
      is_used: { type: INTEGER, default: 0 },
      created_at: {
        type: "TIMESTAMP",
        default: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: true,
      },
      updated_at: {
        type: "TIMESTAMP",
        default: Sequelize.literal("CURRENT_TIMESTAMP"),
        allowNull: true,
      },
    },
    {
      tableName: "ebux_screencode",
      timestamps: false,
    }
  );
  return ebux_screencode;
};
