const Establishment = require("../models/establishment");
const Laboratory = require("../models/laboratory");
const University = require("../models/university");

exports.createEstablishment = async ({ req, resp }) => {
  try {
    let establishment = await Establishment.create(req.body);
    resp.status(200).send(establishment);
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.updateEstablishment = async (req, resp) => {
  try {
    let result = await Establishment.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.findEstablishment = async (req, resp) => {
  try {
    let establishment = await Establishment.findById(req.params._id);
    const university = await University.findById(establishment.university_id);
    resp.status(200).send({ ...establishment, university });
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.findAllEstablishments = async (req, resp) => {
  try {
    const establishments = await Establishment.find();
    const establishments_1 = await Promise.all(
      establishments.map(async (establishment) => ({
        ...establishment._doc,
        university: await University.findOne({
          _id: establishment.university_id,
        }),

        laboratories: await Establishment.find({
          establishment_id: establishment._id,
        }),
      }))
    );
    resp.status(200).send(establishments_1);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.deleteEstablishment = async (req, resp) => {
  try {
    const result = await Establishment.deleteOne({ _id: req.params._id });
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.getEstablishmentLaboratories = async (req, resp) => {
  try {
    const labos = await Laboratory.find({ establishment_id: req.params._id });
    resp.status(200).send(labos);
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};
