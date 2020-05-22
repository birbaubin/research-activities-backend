const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;
const Publication = require("./publication");
const User = require("./user");

const FollowedUserSchema = new Schema({
  scholarId: String,
  name: String,
  email: String,
  indexes: Array,
  university: String,
  coauthors: Array,
  citationsPerYear: Array,
  interests: Array,
  publications: [Publication.PublicationSchema],
  profilePicture: String,
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const FollowedUserModel = mongoose.model("followed-user", FollowedUserSchema);

module.exports = FollowedUserModel;
