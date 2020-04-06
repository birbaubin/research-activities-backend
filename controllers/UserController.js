const User = require('../models/user');
const FollowedUser = require('../models/followed-user');


    
exports.createUser = function(req, resp){

        try {
          const user =  UserModel.create({ email, password });
          return done(null, user);
        } catch (error) {
          done(error);
        }

        User.create({email:"name",password:"pass"})
        .then(user =>{
            resp.send(user);
        })
        .catch(error=>{
            console.log(error);
            resp.send("error");
        });
    }

        
exports.updateUser = function(req, resp){

    User.updateOne({_id: req.body._id}, {$set: req.body})
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
        resp.send({following: true, user: JSON.parse(foundUser._doc.otherProperties) });
    })
    .catch(error=>{
        resp.send(error);
    })
 }

 


