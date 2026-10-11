const mongoose = require("mongoose");
const Schema = mongoose.Schema;

module.exports = {
  schema: new mongoose.Schema(
    {
      request_url: { type: String },
      request_method: { type: String },
      request_payload: { type: mongoose.Schema.Types.Mixed },
      response: { type: Object },
      user_details: { type: Object },
      response: { type: Object },
      error: { type: String },
    },
    {
      versionKey: false,
      timestamps: true,
      collection: "log",
    }
  ),
};
