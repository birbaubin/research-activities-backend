const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const Publication = require("./publication");
const User = require("./user");

const FollowedUserSchema = new Schema({
  _filled: Boolean,
  affiliation: String,
  citedby: Number,
  citedby5y: Number,
  coauthors: [
    {
      _filled: Boolean,
      affiliation: String,
      id: String,
      name: String,
    },
  ],
  email: String,
  hindex: Number,
  hindex5y: Number,
  i10index: Number,
  id: String,
  interests: [String],
  name: {
    type: String,
    required: true,
  },
  publications: {
    type: [Publication.PublicationSchema],
  },
  url_picture: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const FollowedUserModel = mongoose.model("followed-user", FollowedUserSchema);

module.exports = FollowedUserModel;
