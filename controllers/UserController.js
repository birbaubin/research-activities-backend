const User = require('../models/user');
const FollowedUser = require('../models/followed-user');
const roles = require('../helpers/role');
const userHelper = require('../helpers/user-helper');
const TeamMemberShip = require('../models/team-membership');
const bcrypt = require('bcrypt');
const Laboratory = require("../models/laboratory");
const Team = require('../models/team');
const fs = require('fs');


    
exports.createUser = function(req, resp){

        const { email, password, role} = req.body;
        const rolesArray  = [roles.CED_HEAD, roles.LABORATORY_HEAD, roles.SEARCHER]
        console.log(req.body.role)
        if(!rolesArray.includes(req.body.role)){
            console.log("error occured")
            resp.status(400).send({error: "Incorrect role value"})
        }
        else{
        
            User.create({email, password, role, has_confirmed: false, generatedPassword: password, profile_picture: "default.png"})
            .then(user =>{
                resp.send(user);
            })
            .catch(error=>{
                console.log(error);
                resp.send("error");
            });
           }
        
    }

        
exports.updateUser = async function(req, resp){

    User.updateOne({_id: req.body._id}, {$set: req.body, has_confirmed: true, generatedPassword: ""})
            .then(result=>{
                resp.send(result);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error)
            })
    
}

exports.findUser = function(req, resp){

    User.findById(req.params._id)
                .then(school=>{
                    resp.send(school);
                })
                .catch(error=>{
                    console.log(error);
                })
    
}

exports.findAllUsers = function(req, resp){

   User.find()
            .then(users=>{
                resp.send(users);
                })
            .catch(error=>{
                console.log(error);
                resp.send(error);
            })

    
}

exports.deleteUser = function(req, resp){

    User.deleteOne({_id: req.params._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send(error);
                })
 }

 exports.isFollowing = function(req, resp){

    FollowedUser.findOne({name: req.body.name})
                .then(result=>{
                    console.log(result);
                })

 }

 exports.followUser = function(req, resp){

    //console.log(req.body);
    FollowedUser.create(req.body).then(result=>{
        console.log(result);
        resp.send({status: "User followed"});
    })
    .catch(error=>{
        resp.status(500).send(error);
    })
   
 }


 exports.unfollowUser = function(req, resp){
     FollowedUser.findByIdAndDelete(req.params._id).then(result=>{
         resp.send({status: "User unfollowed"});
     })
     .catch(error=>{
         resp.status(500).send(error);
     })
 }
 

 exports.isFollowing = function(req, resp){

    FollowedUser.findOne({name: req.params.name}).then(foundUser=>{
        console.log(foundUser._doc);
        resp.send({isFollowing: true, user: foundUser });
    })
    .catch(error=>{
        resp.send({isFollowing: false});
    })
 }

 exports.getFollowedUsers = function(req, resp){


    if(req.param('lab_name')==undefined){
        FollowedUser.find().then(result=>{
            resp.send(result);
        })
        .catch(error=>{
            resp.status(500).send(error);
        })
    }

    else{
        let userIds = [];
        let memberships = [];
       Laboratory.findOne({name: req.param('lab_name')})
                .then(laboratory=>{
                if(laboratory == null)
                    resp.status(404).send({message: "Laboratory not found"});
                else
                   
                   return Team.find({laboratory_id: laboratory._id})
                   
                })
                .then(teams=>{
                
                    teams.forEach(team=>{
                        memberships.push(TeamMemberShip.findOne({team_id: team._id, active: true}));
                    })
                
                    return Promise.all(memberships);
                })
                .then(memberships=>{
                    console.log(memberships);
                    memberships.forEach(membership=>{
                        userIds.push(membership.user_id);
                    })

                    console.log(userIds);
                    let followedUsers = [];
                    userIds.forEach(userId=>{
                        followedUsers.push(FollowedUser.findOne({user_id: userId}));
                    })

                    return Promise.all(followedUsers);
                })
                .then(followedUsers=>{
                    console.log(followedUsers);
                    resp.send(followedUsers);
                })
                 
                .catch(error=>{
                    resp.status(500).send(error);
                    console.log(error);
                });

    }
   
 }



 exports.updatePassword = async function(req, resp){

    const hash = await bcrypt.hash(req.body.password, 10);
     User.updateOne({_id: req.params._id}, {$set: {password: hash}})
        .then(result=>{
            console.log(result);
            resp.send(result);
        })
        .catch(error=>{
            console.log(error);
            resp.status(500).send(error);
        })
 }

exports.getLabHeads = async function(req, resp){
    

    try{
        const labHeads = await User.find({ role: roles.LABORATORY_HEAD});
        resp.send({labHeads});
    }
    catch(error){
        resp.status(500).send(error)
    }
   
                            
}


exports.updateProfilePicture = async function(req, resp){
    

    let file = req.files.file;
    let user = userHelper.requesterUser(req);
    let userFromDB = await User.findById(user._id, "profile_picture");
    if(userFromDB.profile_picture!=undefined && userFromDB.profile_picture!="default.png"){
        fs.unlink(__dirname+"/../public/images/"+userFromDB.profile_picture, (err)=>{
            if(err)
                resp.status(500).send(err)
        });
    }
        
    let fileUrl = user._id+file.name;
    let filePath = __dirname+"/../public/images/"+fileUrl;
    file.mv(filePath, function(err){
        if(err)
            resp.status(500).send(err);
        else{
            User.updateOne({_id: user._id}, {$set: {profile_picture: fileUrl}}).then(done=>{
                resp.send({message: "file uploaded"}); 
            })
            .catch(error=>{
                resp.status(500).send(error);
            })
           
        }   
            

    });
    
}

