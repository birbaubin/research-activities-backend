const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
  name: {
    type: String,
    required: [true],
  },
  abbreviation: {
    type: String,
    required: [true],
  },
  address: {
    type: String,
    required: [true],
  },
  university_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: [true],
  },
});

const School = mongoose.model("school", SchoolSchema);
module.exports = School;
