const psdb = require("../configs/postgres.config");
const constants = {
  amazonAttributeCollection: {
    sales: [psdb.sequelize.fn("sum", psdb.sequelize.col("sales")), "sales"],
    spend: [psdb.sequelize.fn("sum", psdb.sequelize.col("spend")), "spend"],
    impressions: [
      psdb.sequelize.fn("sum", psdb.sequelize.col("impressions")),
      "impressions",
    ],
    roas: [
      psdb.sequelize.literal(
        "(CASE WHEN sum(spend) = 0 THEN 0 ELSE (sum(sales)/sum(spend)) END)"
      ),
      "roas",
    ],
  },
  zeptoAttributeCollection: {
    sales: [psdb.sequelize.fn("sum", psdb.sequelize.col("revenues")), "sales"],
    spend: [psdb.sequelize.fn("sum", psdb.sequelize.col("spend")), "spend"],
    impressions: [
      psdb.sequelize.fn("sum", psdb.sequelize.col("impressions")),
      "impressions",
    ],
    roas: [
      psdb.sequelize.literal(
        "(CASE WHEN sum(spend) = 0 THEN 0 ELSE (sum(revenues)/sum(spend)) END)"
      ),
      "roas",
    ],
  },
  flipkartAttributeCollection: {
    sales: [
      psdb.sequelize.fn("sum", psdb.sequelize.col("total_revenue")),
      "sales",
    ],
    spend: [psdb.sequelize.fn("sum", psdb.sequelize.col("spend")), "spend"],
    impressions: [
      psdb.sequelize.fn("sum", psdb.sequelize.col("views")),
      "impressions",
    ],
    roas: [
      psdb.sequelize.literal(
        "(CASE WHEN sum(spend) = 0 THEN 0 ELSE (sum(total_revenue)/sum(spend)) END)"
      ),
      "roas",
    ],
  },
};

module.exports = constants;
