const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamMembershipSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true],
  },
  team_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team",
    require: [true],
  },
  active: {
    type: Boolean,
    required: true,
  },
});

const TeamMembership = mongoose.model("team-membership", TeamMembershipSchema);
module.exports = TeamMembership;
