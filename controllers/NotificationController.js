const Notification = require("../models/notification");
const Laboratory = require("../models/laboratory");
const University = require("../models/university");
const Establishment = require("../models/establishment");
const User = require("../models/user");
const TeamMembership = require("../models/team-membership");
const Team = require("../models/team");
const FollowedUser = require("../models/followed-user");

exports.findUserNotifications = async (req, resp) => {
  try {
    const notifications = await Notification.find({
      user_id: req.params.user_id,
      isRead: false,
    });
    resp.status(200).send(notifications);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.notifyFolloweers = async (req, resp) => {
  try {
    const publication = req.body.publication;
    const followedUserId = req.body.followed_user_id;
    const scholarId = req.body.scholar_id;
    const currentPublications = req.body.current_publications;

    if (!publication || !followedUserId || !scholarId || !currentPublications)
      throw Error("No publication or No followedUserId or scholarId");

    const isUpdated = await FollowedUser.updateOne(
      { user_id: followedUserId },
      { $set: { publications: currentPublications } }
    );

    if (!isUpdated.ok) throw Error("reseracher publications were not updated");

    const followedUserTeams = await TeamMembership.find({
      user_id: followedUserId,
      active: true,
    });

    const teams = await Promise.all(
      followedUserTeams.map(async ({ team_id }) => await Team.findById(team_id))
    );

    const laboratories = await Promise.all(
      teams.map(
        async ({ laboratory_id }) => await Laboratory.findById(laboratory_id)
      )
    );

    const followersIds = [
      ...teams.map(({ head_id }) => head_id),
      ...laboratories.map(({ head_id }) => head_id),
    ];

    console.log("followersIds", followersIds);

    const followedUser = await User.findById(followedUserId);
    const fullName = followedUser.firstName + " " + followedUser.lastName;
    const response = await Promise.all(
      followersIds.map(
        async (user_id) =>
          await Notification.create({
            user_id,
            scholarId,
            publication,
            profilePicture: followedUser.profilePicture,
            fullName,
          })
      )
    );

    resp.status(200).send(response);
  } catch (error) {
    console.log(error);
    resp.status(500).send(error);
  }
};

exports.markNotificationAsRead = async (req, resp) => {
  try {
    const notificationId = req.params.notification_id;
    const response = await Notification.updateOne(
      { _id: notificationId },
      { $set: { isRead: true } }
    );

    resp.status(200).send(response);
  } catch (error) {
    console.log(error);
    resp.status(500).send("error");
  }
};
