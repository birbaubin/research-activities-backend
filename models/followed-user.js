const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const FollowedUserSchema = new Schema({

  
  name : {
    type : String,
    required : true
  },
  otherProperties : {
    type : String,
    required : true
  }
});





const FollowedUserModel = mongoose.model('followed-user',FollowedUserSchema);

module.exports = FollowedUserModel;