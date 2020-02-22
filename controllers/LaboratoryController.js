const Laboratory = require('../models/laboratory');


    
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
                .then(school=>{
                    resp.send(school);
                })
                .catch(error=>{
                    console.log(error);
                })
    
}

exports.findAllLaboratorys = function(req, resp){

   Laboratory.find()
            .then(laboratories=>{
                resp.send(laboratories);
                })
            .catch(error=>{
                console.log(error);
                resp.send(error);
            })

    
}

exports.deleteLaboratory = function(req, resp){

    Laboratory.deleteOne({_id: req.body._id})
                .then(result=>{
                    resp.send(result);
                })
                .catch(error=>{
                    console.log(error);
                    resp.send(error);
                })
 }

 


