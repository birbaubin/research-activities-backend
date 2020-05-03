const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PublicationSchema = new Schema({
  _filled: {
    type: Boolean,
    required: true,
  },
  bib: {
    title: String,
    year: Number,
  },
  cited_by: {
    type: Number,
    required: false,
  },
  id_citations: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
});

const Publication = mongoose.model("publication", PublicationSchema);
module.exports.Publication = Publication;
module.exports.PublicationSchema = PublicationSchema;
