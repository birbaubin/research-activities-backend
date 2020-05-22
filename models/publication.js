const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
  title: {
    type: String,
  },
  authors: {
    type: Array,
  },
  citation: {
    type: Number,
  },
  year: {
    type: String,
  },
});

const Publication = mongoose.model("publication", PublicationSchema);
module.exports.Publication = Publication;
module.exports.PublicationSchema = PublicationSchema;
