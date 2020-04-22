const Team = require('../models/team');
const Laboratory = require('../models/laboratory');
const TeamMemberShip = require('../models/team-membership');
const User = require('../models/user');

    
exports.createTeam = function(req, resp){

        Team.create(req.body)
        .then(team =>{
            resp.send(team);
        })
        .catch(error=>{
            console.log(error);
            resp.send("error");
        });
    }

        
exports.updateTeam = function(req, resp){

    Team.updateOne({_id: req.body._id}, {$set: req.body})
            .then(result=>{
                resp.send(result);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error)
            })
    
}

exports.findTeam = function(req, resp){

    Team.findById(req.params._id)
                .then(team=>{
                    resp.send(team);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send("error");
                })
    
}

exports.findAllTeams = function(req, resp){

    Team.find()
    .then(teams=>{
        teams.forEach(team => {
                Laboratory.findById(team.laboratory_id)
                    .then(laboratory=>{

                        team._doc.laboratory = {
                            name: laboratory.name
                        }
                        //console.log(schools);  
                    })
        });
        
           setTimeout(() => {
                resp.send(teams);
           }, 200); 
       
        })
    .catch(error=>{
        console.log(error);
        resp.send(error);
    })
    
}

exports.deleteTeam = function(req, resp){

    Team.deleteOne({_id: req.params._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send(error);
        })
     
 }

 exports.addUserToTeam = async function(req, resp){

    try{
        TeamMemberShip.create({user_id: req.params.user_id, team_id: req.params.team_id, active: true})
                        .then(result=>{
                            console.log(result);
                            resp.send(result);
                        })
                        .catch(error=>{
                            resp.status(500).send(error);
                            console.log(error);
                        })
    
    }
    catch(error){
        console.log(error)
        resp.status(500).send(error);
    }
               
 }

 exports.removeFromTeam = function(req, resp){
     TeamMemberShip.updateMany({user_id: req.params.user_id, team_id: req.params.team_id, active: true}, {active: false})
                    .then(result=>{
                        resp.send(result);
                    })
                    .catch(error=>{
                        resp.status(500).send(error);
                    })
 }

 



