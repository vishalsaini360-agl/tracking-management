const users = require("./users");
const { DataTypes } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const ds_product_keyword_tag_links = sequelize.define(
    "ds_product_keyword_tag_links",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        // allowNull: false,
      },
      tag_id: { type: DataTypes.INTEGER },
      sku_or_keyword: { type: DataTypes.STRING },

      created_by: { type: DataTypes.STRING },
      created_at: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW }
    },
    {
      tableName: "product_keyword_tag_links",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["tag_id", "sku_or_keyword"],
        }
      ]
    }
  );

  ds_product_keyword_tag_links.associate = function (models) {
    ds_product_keyword_tag_links.belongsTo(models.ds_product_keyword_tags, {
      foreignKey: "id",
      sourceKey: "tag_id",
    });
  };
  // ds_product_keyword_tag_links.sync({ alter: true });

  return ds_product_keyword_tag_links;
};

