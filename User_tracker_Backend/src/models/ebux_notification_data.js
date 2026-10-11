const mongoose = require("mongoose");
const { NUMBER } = require("sequelize");
module.exports = {
  schema: new mongoose.Schema(
    {
      title: { type: String },
      description: { type: String },
      read_status: { type: String }, //0 -> Unread 1->Read
      account_id: { type: String },
      platform_id: { type: String },
      source: { type: String },
      type: { type: String },
      status: { type: String },
    },
    {
      versionKey: false,
      timestamps: true,
      collection: "ebux_notification_data",
    }
  ),
};
