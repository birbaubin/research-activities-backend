const Establishment = require("../models/establishment");
const Laboratory = require("../models/laboratory");
const University = require("../models/university");

exports.createEstablishment = (req, resp) => {
  if (req.body)
    Establishment.create(req.body)
      .then((establishment) => {
        resp.send(establishment);
      })
      .catch((error) => {
        console.log(error);
        resp.send("error");
      });
};

exports.updateEstablishment = (req, resp) => {
  Establishment.updateOne({ _id: req.body._id }, { $set: req.body })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.findEstablishment = (req, resp) => {
  Establishment.findById(req.params._id)
    .then((establishment) => {
      University.findById(establishment.university_id).then((university) => {
        let establishmentObject = {};
        Object.assign(establishmentObject, establishment._doc);
        establishmentObject.univertity = {
          name: university.name,
        };

        resp.send(establishmentObject);
      });
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.findAllEstablishments = (req, resp) => {
  Establishment.find()
    .then((establishments) =>
      Promise.all(
        establishments.map(async (establishment) => ({
          ...establishment._doc,
          university: await University.findOne({ _id: establishment.university_id }),
          laboratories: await Establishment.find({ establishment_id: establishment._id }),
        }))
      )
    )
    .then((establishments) => {
      resp.send(establishments);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.deleteEstablishment = (req, resp) => {
  Establishment.deleteOne({ _id: req.params._id })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};

exports.getEstablishmentLaboratories = (req, resp) => {
  Laboratory.find({ establishment_id: req.params._id })
    .then((labos) => {
      resp.send(labos);
    })
    .catch((error) => {
      console.log(error);
      resp.send("error");
    });
};
