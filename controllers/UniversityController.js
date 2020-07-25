const University = require("../models/university");
const Establishment = require("../models/establishment");

exports.createUniversity = (req, resp) => {
  console.log(req.body);

  University.create(req.body)
    .then((university) => {
      resp.send(university);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.updateUniversity = (req, resp) => {
  University.updateOne({ _id: req.body._id }, { $set: req.body })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.findUniversity = (req, resp) => {
  University.findById(req.params._id)
    .then((university) => {
      resp.send(university);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.findAllUniversities = (req, resp) => {
  University.find()
    .then((universities) => {
      resp.send(universities);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.deleteUniversity = (req, resp) => {
  University.deleteOne({ _id: req.params._id })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.getUniversityEstablishments = (req, resp) => {
  Establishment.find({ university_id: req.params._id })
    .then((universities) => {
      resp.send(universities);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};
