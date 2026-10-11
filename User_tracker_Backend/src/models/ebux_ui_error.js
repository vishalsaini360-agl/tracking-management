const mongoose  = require('mongoose');

const Schema  = mongoose.Schema;

const LogSchema = new Schema({
    name: String,
    info: mongoose.Schema.Types.Mixed,
    type: String,
    user_info: mongoose.Schema.Types.Mixed,

},{
      versionKey: false,
      timestamps: true,
    collection: 'ebux_ui_error'});

module.exports = mongoose.model('ebux_ui_error', LogSchema);