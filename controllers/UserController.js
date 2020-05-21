const fs = require("fs");
const bcrypt = require("bcrypt");

const User = require("../models/user");
const FollowedUser = require("../models/followed-user");
const TeamMemberShip = require("../models/team-membership");
const Laboratory = require("../models/laboratory");
const Team = require("../models/team");
const mailSender = require("../helpers/mail-sender");
const roles = require("../helpers/role");
const userHelper = require("../helpers/user-helper");

exports.createUser = (req, resp) => {
  const { email, password, role } = req.body;
  const rolesArray = [roles.CED_HEAD, roles.LABORATORY_HEAD, roles.RESEARCHER];
  if (!rolesArray.includes(req.body.role)) {
    console.log("error occured");
    resp.status(400).send({ error: "Incorrect role value" });
  } else {
    User.create({
      email,
      password,
      role,
      generatedPassword: password,
    })
      .then((user) => {
        return mailSender.sendEmail(user)
      })
      .then((user)=>{
        resp.send(user);
      })
      .catch((error) => {
        console.log(error);
        resp.status(500).send(error);
      });

  }
};

exports.updateUser = async (req, resp) => {
  User.updateOne(
    { _id: req.body._id },
    { $set: req.body, hasConfirmed: true, generatedPassword: "" }
  )
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.findUser = (req, resp) => {
  User.findById(req.params._id)
    .then(async (user) => {
      const laboratoriesHeaded = await Laboratory.find({
        head_id: user._id,
      });

      const teamsMemberships = await TeamMemberShip.find({
        user_id: user._id,
        active: true,
      }).then((teamsMemberships) =>
        Promise.all(
          teamsMemberships.map((teamsMembership) =>
            Team.findOne({ _id: teamsMembership.team_id })
          )
        )
      );

      const correspondingFollowedUser = await FollowedUser.findOne({user_id: user._id});

      resp.send({
        ...user._doc,
        laboratoriesHeaded,
        teamsMemberships,
        correspondingFollowedUser
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.findAllUsers = (req, resp) => {
  User.find()
    .then((users) => {
      resp.send(users);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.deleteUser = (req, resp) => {
  User.deleteOne({ _id: req.params._id })
    .then((result) => {
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.send(error);
    });
};

exports.isFollowing = (req, resp) => {
  FollowedUser.findOne({ name: req.body.name }).then((result) => {
    console.log(result);
  });
};

exports.followUser = (req, resp) => {
  //console.log(req.body);
  FollowedUser.create(req.body)
    .then((result) => {
      console.log(result);
      resp.send({ status: "User followed" });
    })
    .catch((error) => {
      resp.status(500).send(error);
    });
};

exports.unfollowUser = (req, resp) => {
  FollowedUser.findByIdAndDelete(req.params._id)
    .then((result) => {
      resp.send({ status: "User unfollowed" });
    })
    .catch((error) => {
      resp.status(500).send(error);
    });
};

exports.isFollowing = (req, resp) => {
  FollowedUser.findOne({ name: req.params.name })
    .then((foundUser) => {
      console.log(foundUser._doc);
      resp.send({ isFollowing: true, user: foundUser });
    })
    .catch((error) => {
      resp.send({ isFollowing: false });
    });
};

exports.getFollowedUsers = async (req, resp) => {
  const laboratoryAbbreviation = req.param("laboratory_abbreviation");
  const teamAbbreviation = req.param("team_abbreviation");
  
  const followedUsers = await FollowedUser.find();
  const followedUsersIds = followedUsers.map(({ user_id }) => user_id);

  if (!laboratoryAbbreviation && !teamAbbreviation) {
    resp.send(await FollowedUser.find());
  }

  if (laboratoryAbbreviation) {
    const laboratory = await Laboratory.findOne({
      abbreviation: req.param("laboratory_abbreviation"),
    });

    const teams = await Team.find({
      laboratory_id: laboratory._id,
    });

    const teamsMemberShips = await Promise.all(
      teams.map((team) =>
        TeamMemberShip.find({
          team_id: team._id,
          active: true,
          user_id: { $in: followedUsersIds },
        })
      )
    );

    const followedUsers = await Promise.all(
      teamsMemberShips
        .flatMap((t) => t)
        .map(({ user_id }) => FollowedUser.findOne({ user_id }))
    );

    resp.send(followedUsers);
  }

  if (teamAbbreviation) {
    const team = await Team.findOne({
      abbreviation: teamAbbreviation,
    });

    const teamsMemberShips = await TeamMemberShip.find({
      team_id: team._id,
      active: true,
      user_id: { $in: followedUsersIds },
    });

    console.log("teamsMemberShips");
    console.log(teamsMemberShips);

    const followedUsers = await Promise.all(
      teamsMemberShips.map(({ user_id }) => FollowedUser.findOne({ user_id }))
    );

    resp.send(followedUsers);
  }
}

exports.updatePassword = async (req, resp) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  User.updateOne({ _id: req.params._id }, { $set: { password: hash } })
    .then((result) => {
      console.log(result);
      resp.send(result);
    })
    .catch((error) => {
      console.log(error);
      resp.status(500).send(error);
    });
};

exports.getLaboratoryHeads = async (req, resp) => {
  try {
    const laboratoryHeads = await User.find({ role: roles.LABORATORY_HEAD });
    resp.send(laboratoryHeads);
  } catch (error) {
    resp.status(500).send(error);
  }
};

exports.getResearchers = async (req, resp) => {
  try {
    const researchers = await User.find({ role: roles.RESEARCHER });
    resp.send(researchers);
  } catch (error) {
    resp.status(500).send(error);
  }
};

exports.updateProfilePicture = async (req, resp) => {
  let file = req.files.file;
  let user = userHelper.requesterUser(req);
  let userFromDB = await User.findById(user._id, "profilePicture");
  if (
    userFromDB.profilePicture != undefined &&
    userFromDB.profilePicture != "default.png"
  ) {
    fs.unlink(
      __dirname + "/../public/images/" + userFromDB.profilePicture,
      (err) => {
        if (err) resp.status(500).send(err);
      }
    );
  }

  let fileUrl = user._id + file.name;
  let filePath = __dirname + "/../public/images/" + fileUrl;
  file.mv(filePath, function (err) {
    if (err) resp.status(500).send(err);
    else {
      User.updateOne({ _id: user._id }, { $set: { profilePicture: fileUrl } })
        .then((done) => {
          resp.send({ message: "file uploaded", profilePicture: fileUrl });
        })
        .catch((error) => {
          resp.status(500).send(error);
        });
    }
  });
};

exports.getFilteringOptions = async (req, resp) => {
  const teams = await Team.find();
  const followedUsers = await FollowedUser.find();
  const followedUsersIds = followedUsers.map(({ user_id }) => user_id);

  const teamsOptionsPromises = teams.map(async (team) => {
    const teamsMemberShips = await TeamMemberShip.find({
      team_id: team._id,
      user_id: { $in: followedUsersIds },
      active: true,
    });

    return {
      ...team._doc,
      membershipCount: teamsMemberShips.length,
      optionType: "team",
    };
  });

  const laboratories = await Laboratory.find();

  const laboratoriesOptionsPromises = laboratories.map(async (laboratory) => {
    const teams = await Team.find({
      laboratory_id: laboratory._id,
    });

    const teamsMemberShips = await Promise.all(
      teams.map((team) =>
        TeamMemberShip.find({
          team_id: team._id,
          user_id: { $in: followedUsersIds },
          active: true,
        })
      )
    );

    return {
      ...laboratory._doc,
      membershipCount: teamsMemberShips.flatMap((t) => t).length,
      optionType: "laboratory",
    };
  });

  const teamsOptions = await Promise.all(teamsOptionsPromises);
  const laboratoriesOptions = await Promise.all(laboratoriesOptionsPromises);

  resp.send([...teamsOptions, ...laboratoriesOptions]);
};
