const User = require('../models/user');
const FollowedUser = require('../models/followed-user');
const roles = require('../helpers/role');
const userHelper = require('../helpers/user-helper');
    
exports.createUser = function(req, resp){

        const { email, password, role} = req.body;
        const rolesArray  = [roles.CED_HEAD, roles.LABORATORY_HEAD, roles.SEARCHER]
        console.log(req.body.role)
        if(!rolesArray.includes(req.body.role)){
            console.log("error occured")
            resp.status(400).send({error: "Incorrect role value"})
        }
        else{
            const token = userHelper.requesterUser(req).role;
        
           if(req.body.role==roles.SEARCHER && role==roles.SEARCHER)
           {
               resp.status(401).send({message: "You are not authorized to make this action"});
           }
           else{
            User.create({email, password, role, has_confirmed: false})
            .then(user =>{
                resp.send(user);
            })
            .catch(error=>{
                console.log(error);
                resp.send("error");
            });
           }
        }  
    }

        
exports.updateUser = function(req, resp){


    const user = requesterUser(req);
    User.updateOne({_id: req.body._id}, {$set: req.body, has_confirmed: true})
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

    FollowedUser.create({name: req.body.name, otherProperties: JSON.stringify(req.body)})
    resp.send({status: "User followed"});
 }

 exports.isFollowing = function(req, resp){

    FollowedUser.findOne({name: req.params.name}).then(foundUser=>{
        console.log(foundUser._doc);
        resp.send({isFollowing: true, user: JSON.parse(foundUser._doc.otherProperties) });
    })
    .catch(error=>{
        resp.send({isFollowing: false});
    })
 }

 


