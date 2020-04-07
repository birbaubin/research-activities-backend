const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;


const UserSchema = new Schema({

  
  firstName : {
    type : String,
    required : false
  },
  lastName : {
    type : String,
    required : false
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  },
  role: {
    type: String,
    required: true
  },
  has_confirmed: {
    type: Boolean,
    required: true
  }
});


UserSchema.pre('save', async function(next){
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  this.has_confirmed = false;
  next();
});

UserSchema.methods.isValidPassword = async function(password){
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

const UserModel = mongoose.model('user',UserSchema);

module.exports = UserModel;