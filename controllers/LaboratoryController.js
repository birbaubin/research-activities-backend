const Laboratory = require("../models/laboratory");
const Establishment = require("../models/establishment");
const userHelper = require("../helpers/user-helper");
const Team = require("../models/team");

exports.createLaboratory = (req, resp) => {
  const lab = req.body;
  Laboratory.create(lab)
    .then((laboratory) => {
      resp.send(laboratory);
    })
    .catch((error) => {
      console.log(error);
      resp.status(500).send(error);
    });
};

exports.updateLaboratory = (req, resp) => {
  Laboratory.updateOne({ _id: req.body._id }, { $set: req.body })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.status(500).send(error);
    });
};

exports.findLaboratory = (req, resp) => {
  Laboratory.findById(req.params._id)
    .then(async (laboratory) => ({
      ...laboratory._doc,
      establishment: await Establishment.findById(laboratory.establishment_id),
      teams: await Team.find({ laboratory_id: laboratory._id }),
    }))
    .then((laboratory) => {
      resp.send(laboratory);
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.findAllLaboratories = (req, resp) => {
  Laboratory.find()
    .then((laboratories) =>
      Promise.all(
        laboratories.map(async (laboratory) => ({
          ...laboratory._doc,
          establishment: await Establishment.findById(laboratory.establishment_id),
          teams: await Team.find({ laboratory_id: laboratory._id }),
        }))
      )
    )
    .then((laboratories) => {
      resp.send(laboratories);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.deleteLaboratory = (req, resp) => {
  Laboratory.deleteOne({ _id: req.params._id })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.getLaboratoriesOfHead = (req, resp) => {
  Laboratory.find({ head_id: req.params.head_id })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      resp.status(500).send(error);
    });
};

exports.getFreeLaboratories = (req, resp) => {
  Laboratory.$where("this.head_id === undefined")
    .find()
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      resp.status(500).send(result);
    });
};

exports.associateHeadToLaboratory = (req, resp) => {
  Laboratory.findById(req.params.lab_id)
    .then((result) => {
      result.head_id = req.params.head_id;

      const date = new Date();
      const today = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`; 

      result.head_history.forEach(element => {
        if(element.active){
          element.active = false;
          element.end = today;
        }
      });

      
      let head_history_item = {
        head_id: req.params.head_id,
        start: today,
        end: null,
        active: true
      };

      result.head_history.push(head_history_item);

      result.save();
      resp.send(result);
    })
    .catch((error) => {
      resp.status(500).send(error);
    });
};
