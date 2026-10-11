const users = require("./users");
const { DataTypes, hasMany } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  const ds_product_keyword_tags = sequelize.define(
    "ds_product_keyword_tags",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ds_client_id: { type: DataTypes.STRING },

      tag_name: { type: DataTypes.STRING },
      tag_type: { type: DataTypes.STRING },
      tag_color: { type: DataTypes.STRING },
      created_by: { type: DataTypes.STRING },
      created_at: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW },
      updated_by: { type: DataTypes.STRING },
      updated_at: { 
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW }
    },
    {
      tableName: "product_keyword_tags",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["ds_client_id", "tag_name","tag_type"],
        }
      ]
    }
  );

  ds_product_keyword_tags.associate = function (models) {
    ds_product_keyword_tags.hasMany(models.ds_product_keyword_tag_links, {
      foreignKey: "tag_id",
      sourceKey: "id",
      as: 'tag_details' 
    });
  };
  // ds_product_keyword_tags.sync({ alter: true });

  return ds_product_keyword_tags;
};