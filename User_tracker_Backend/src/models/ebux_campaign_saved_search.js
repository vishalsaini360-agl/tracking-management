const mongoose = require("mongoose");

module.exports = {
  schema: new mongoose.Schema(
    {
      user_id: { type: String, required: true },
      filters: { type: Object, required: true },
      name: { type: String, required: true },
      media_type: { type: String,default:"" },
      isDeleted: { type: Boolean, default: false },
      account_id: { type: String,default:"" },
      status: { type: Boolean, default: false },
    },
    {
      versionKey: false,
      timestamps: true,
      collection: "ebux_campaign_saved_search",
    }
  ),
};
