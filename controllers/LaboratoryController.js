const Laboratory = require('../models/laboratory');
const School = require('../models/school');

    
exports.createLaboratory = function(req, resp){

        Laboratory.create(req.body)
        .then(laboratory =>{
            resp.send(laboratory);
        })
        .catch(error=>{
            console.log(error);
            resp.send("error");
        });
    }

        
exports.updateLaboratory = function(req, resp){

    Laboratory.updateOne({_id: req.body._id}, {$set: req.body})
            .then(result=>{
                resp.send(result);
            })
            .catch(error=>{
                console.log(error);
                resp.send(error)
            })
    
}

exports.findLaboratory = function(req, resp){

    Laboratory.findById(req.params._id)
                .then(laboratory=>{
                    
                    School.findById(laboratory.school_id)
                    .then(school=>{

                        let laboratoryObject = {};
                        Object.assign(laboratoryObject, laboratory._doc);
                        laboratoryObject.school = {
                            name: school.name
                        }
                        //console.log(schoolObject);
                        

                        //console.log(university);
                        resp.send(laboratoryObject);
                        
                    })
                })
                .catch(error=>{
                    console.log(error);
                })
    
}

exports.findAllLaboratorys = function(req, resp){

   Laboratory.find()
            .then(laboratories=>{

                 laboratories.forEach(laboratory => {
                    
                        School.findById(laboratory.school_id)
                            .then(school=>{

                                laboratory._doc.school = {
                                    name: school.name
                                }
                                //console.log(schools);  
                            })
                });
                

                   setTimeout(() => {
                        resp.send(laboratories);
                   }, 200); 
               
                })
            .catch(error=>{
                console.log(error);
                resp.send(error);
            })

    
}

exports.deleteLaboratory = function(req, resp){

    Laboratory.deleteOne({_id: req.params._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send(error);
                })
 }

 


