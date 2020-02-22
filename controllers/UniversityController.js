const University = require('../models/university');
const School = require('../models/school');

    
exports.createUniversity = function(req, resp){

        University.create(req.body)
        .then(university =>{
            resp.send(university);
        })
        .catch(error=>{
            console.log(error);
            resp.send("error");
        });
    }

        
exports.updateUniversity = function(req, resp){

    University.updateOne({_id: req.body._id}, {$set: req.body})
            .then(result=>{
                resp.send(result);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error)
            })
    
}

exports.findUniversity = function(req, resp){

    University.findById(req.params._id)
                .then(university=>{
                    resp.send(university);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send("error");
                })
    
}

exports.findAllUniversities = function(req, resp){

   University.find().then(universities=>{
       resp.send(universities);
   })
   .catch(error=>{
       console.log(error);
       resp.send("error");
   })
    
}

exports.deleteUniversity = function(req, resp){

    University.deleteOne({_id: req.body._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send(error);
                })
     
 }

 exports.getUniversitySchools = function(req, resp){ 


     School.find({university_id: req.params._id})
            .then(universities=>{
                resp.send(universities);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error);
            })
 }


