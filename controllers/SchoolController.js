const School = require("../models/school");
const Laboratory = require("../models/laboratory");
const University = require("../models/university");

exports.createSchool = (req, resp) => {
  if (req.body)
    School.create(req.body)
      .then((school) => {
        resp.send(school);
      })
      .catch((error) => {
        console.log(error);
        resp.send("error");
      });
};

exports.updateSchool = (req, resp) => {
  School.updateOne({ _id: req.body._id }, { $set: req.body })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.findSchool = (req, resp) => {
  School.findById(req.params._id)
    .then((school) => {
      University.findById(school.university_id).then((university) => {
        let schoolObject = {};
        Object.assign(schoolObject, school._doc);
        schoolObject.univertity = {
          name: university.name,
        };

        resp.send(schoolObject);
      });
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.findAllSchools = (req, resp) => {
  School.find()
    .then((schools) =>
      Promise.all(
        schools.map(async (school) => ({
          ...school._doc,
          university: await University.findOne({ _id: school.university_id }),
          laboratories: await School.find({ school_id: school._id }),
        }))
      )
    )
    .then((schools) => {
      resp.send(schools);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.deleteSchool = (req, resp) => {
  School.deleteOne({ _id: req.params._id })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.getSchoolLaboratories = (req, resp) => {
  Laboratory.find({ school_id: req.params._id })
    .then((labos) => {
      resp.send(labos);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};
