const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const Publication = require('./publication');


const FollowedUserSchema = new Schema({

  
  name : {
    type : String,
    required : true
  },
  otherProperties : {
    type : String,
    required : true
  },
  publications: {
    type: [Publication.PublicationSchema],
    required: false
  }

});

const FollowedUserModel = mongoose.model('followed-user',FollowedUserSchema);

module.exports = FollowedUserModel;