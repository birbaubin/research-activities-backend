const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  name: {
    type: String,
    required: [true],
  },
  abbreviation: {
    type: String,
    required: [true],
  },
  head_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  laboratory_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Laboratory",
    required: [true],
  },
});

const Team = mongoose.model("team", TeamSchema);
module.exports = Team;
