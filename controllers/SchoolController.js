const School = require('../models/school');
const Laboratory = require('../models/laboratory');

    
exports.createSchool = function(req, resp){

        School.create(req.body)
        .then(school =>{
            resp.send(school);
        })
        .catch(error=>{
            console.log(error);
            resp.send("error");
        });
    }

        
exports.updateSchool = function(req, resp){

    School.updateOne({_id: req.body._id}, {$set: req.body})
            .then(result=>{
                resp.send(result);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error)
            })
    
}

exports.findSchool = function(req, resp){

    School.findById(req.params._id)
            .then(school=>{
                resp.send(school);
            })
            .catch(error=>{
                console.log(error);
                resp.send("error");
            })
    
}

exports.findAllSchools = function(req, resp){

   School.find()
            .then(universities=>{
                resp.send(universities);
            })
            .catch(error=>{
                console.log(error);
                resp.send("error");
            })
    
}

exports.deleteSchool = function(req, resp){

    School.deleteOne({_id: req.params._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send("error");
                })
     
 }

 exports.getSchoolLaboratories = function(req, resp){ 

    Laboratory.find({school_id: req.params._id})
                .then(labos=>{
                    resp.send(labos);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send("error");
                })
}


