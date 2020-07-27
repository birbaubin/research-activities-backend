const Laboratory = require("../models/laboratory");
const Establishment = require("../models/establishment");
const userHelper = require("../helpers/user-helper");
const University = require("../models/university");
const Team = require("../models/team");
const User = require("../models/user");
const UserModel = require("../models/user");
const TeamMembership = require("../models/team-membership");

exports.createLaboratory = async (req, resp) => {
  try {
    const laboratory = await Laboratory.create(req.body);
    resp.status(200).send(laboratory);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.updateLaboratory = async (req, resp) => {
  try {
    const result = await Laboratory.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.updateLaboratory = async (req, resp) => {
  try {
    const result = await Laboratory.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};
exports.findLaboratory = async (req, resp) => {
  try {
    const laboratory = await Laboratory.findById(req.params._id);
    const establishment = await Establishment.findById(
      laboratory.establishment_id
    );
    const university = await University.findById(establishment.university_id);
    let teams = await Team.find({ laboratory_id: laboratory._id });

    teams = await Promise.all(
      teams.map(async (team) => {
        return {
          ...team._doc,
          teamMemberShipCount: await TeamMembership.find({
            team_id: team._id,
            active: true,
          }),
        };
      })
    );

    const laboratoryHead = await User.findOne({ _id: laboratory.head_id });

    resp.status(200).send({
      ...laboratory._doc,
      university,
      establishment,
      teams,
      laboratoryHead,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.findAllLaboratories = async (req, resp) => {
  try {
    const laboratories = await Laboratory.find();
    const laboratories_1 = await Promise.all(
      laboratories.map(async (laboratory) => ({
        ...laboratory._doc,
        establishment: await Establishment.findById(
          laboratory.establishment_id
        ),
        teams: await Team.find({ laboratory_id: laboratory._id }),
      }))
    );
    resp.status(200).send(laboratories_1);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.deleteLaboratory = async (req, resp) => {
  try {
    const result = await Laboratory.deleteOne({ _id: req.params._id });
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.getLaboratoriesOfHead = async (req, resp) => {
  try {
    const result = await Laboratory.find({ head_id: req.params.head_id });
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.getFreeLaboratories = async (req, resp) => {
  try {
    const result = await Laboratory.$where("this.head_id === undefined").find();
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(result);
  }
};

exports.associateHeadToLaboratory = async (req, resp) => {
  try {
    let laboratory = await Laboratory.findById(req.params.lab_id);
    const head = await User.findById(req.params.head_id);
    const date = new Date();
    const today = `${date.getFullYear()}/${
      date.getMonth() + 1
    }/${date.getDate()}`;

    laboratory.head_history.forEach((element) => {
      if (element.active) {
        element.active = false;
        element.end = today;
      }
    });

    let head_history_item = {
      head: head,
      start: today,
      end: null,
      active: true,
    };

    laboratory.head_history.push(head_history_item);
    laboratory.head_id = head._id;
    const result = await laboratory.save();

    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};
