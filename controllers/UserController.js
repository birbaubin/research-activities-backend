const User = require('../models/user');
const FollowedUser = require('../models/followed-user');
const roles = require('../helpers/role');
const userHelper = require('../helpers/user-helper');
const TeamMemberShip = require('../models/team-membership');
const bcrypt = require('bcrypt');

    
exports.createUser = function(req, resp){

        const { email, password, role} = req.body;
        const rolesArray  = [roles.CED_HEAD, roles.LABORATORY_HEAD, roles.SEARCHER]
        console.log(req.body.role)
        if(!rolesArray.includes(req.body.role)){
            console.log("error occured")
            resp.status(400).send({error: "Incorrect role value"})
        }
        else{
        
            User.create({email, password, role, has_confirmed: false, generatedPassword: password})
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

    FollowedUser.create(req.body).then(result=>{
        resp.send({status: "User followed"});
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
    FollowedUser.find().then(result=>{
        resp.send(result);
    })
    .catch(error=>{
        resp.status(500).send(error);
    })
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


