module.exports = (sequelize, DataTypes) => {
  const ProductPricingOutput = sequelize.define(
    "ProductPricingOutput",
    {
      id: {
        type: DataTypes.STRING(100),
        primaryKey: true,
        allowNull: false,
        unique: true
      },

      product_id: {
        type: DataTypes.STRING(100),
        allowNull: true
      },

      product_name: {
        type: DataTypes.STRING(255),
        allowNull: false
      },

      product_image_url: {
        type: DataTypes.TEXT
      },

      base_platform: {
        type: DataTypes.STRING(100)
      },

      platform_image_url: {
        type: DataTypes.TEXT
      },

      shopify_price: {
        type: DataTypes.DECIMAL(10, 2)
      },

      competitor_price: {
        type: DataTypes.DECIMAL(10, 2)
      },

      delta_price: {
        type: DataTypes.DECIMAL(10, 2)
      },

      suggested_price: {
        type: DataTypes.DECIMAL(10, 2)
      },

      rule_id: {
        type: DataTypes.STRING(100)
      },
      product_variant_id: {
        type: DataTypes.STRING(100)
      },
      remarks: {
        type: DataTypes.TEXT
      },
      status: {
        type: DataTypes.STRING(100)
      },
      last_updated_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "product_pricing_output",
      timestamps: false,
      underscored: true
    }
  );

  ProductPricingOutput.belongsTo(
    sequelize.models.PriceingRule,
    {
      foreignKey: "rule_id",
      targetKey: "id",
      as: "rule"
    }
  );

  return ProductPricingOutput;
};
