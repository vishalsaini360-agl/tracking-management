const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const users = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type:String,
        required:true,
    },
    mobileNo: {
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true,
    },
    profileImage: {
        type: String,
        required: true
    },
    roleId:{
        type:Schema.Types.ObjectId,
        required:true,
    },
    status:{
      type:Number,
      required:true,
      default:1
    },
    createdBy: {
        type: String,
        required: true
    },
    updatedBy:{
        type:String,
        required:true,
    }
}, {
    versionKey: false,
    timestamps:true
});

module.exports = mongoose.model('users', users);
