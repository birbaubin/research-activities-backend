const mongoose = require("mongoose");

const PhdStudent = mongoose.model('phdStudent')
const User = mongoose.model('user')


exports.createPhdStudent = async (req, resp) => {
  try {
    const phdStudent = await PhdStudent.create(req.body);
    resp.status(200).send(phdStudent);
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.updatePhdStudent = async (req, resp) => {
  try {
    const result = await PhdStudent.updateOne(
      { _id: req.body._id },
      { $set: req.body }
    );
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.findPhdStudent = async (req, resp) => {
  try {
      console.log("HEREE")
    const phdStudent = await PhdStudent.findById(req.params._id);
    const supervisor = await User.findOne({ _id: phdStudent.supervisor });
    const coSupervisor = await User.findOne({ _id: phdStudent.coSupervisor });
    

    resp.status(200).send({
      ...phdStudent._doc,
      supervisor,
      coSupervisor,
    });
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};

exports.findAllPhdStudents = async (req, resp) => {
  try {
    const phdStudents = await PhdStudent.find();
    const result = await Promise.all(
      phdStudents.map(async (student) => {
        return {
          ...student._doc,
          supervisor: await User.findById(student.supervisor),
          coSupervisor: await User.findById(student.coSupervisor),

        };
      })
    );

    console.log(result);
    resp.status(200).send(result);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.deletePhdStudent = async (req, resp) => {
  try {
      console.log("HERE")
    const result = await PhdStudent.deleteOne({ _id: req.params._id });
    resp.status(200).send(result);
  } catch (error) {
    console.log("ERROR",error);
    resp.status(500).send(error);
  }
};



