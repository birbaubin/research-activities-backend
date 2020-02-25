const express = require('express');
const passport = require('passport');
const  UniversityController   = require('../controllers/UniversityController');
const SchoolController = require('../controllers/SchoolController');
const LaboratoryController = require('../controllers/LaboratoryController');



const router = express.Router();
router.get('/', (req, res)=>{
    res.send("Research app REST API working  !");
})



//TODO: change naming convention

/*************Universities endpoints ***********/
router.post('/university', (req, resp)=>{
    UniversityController.createUniversity(req, resp);
})

router.put('/university', (req, resp)=>{
    UniversityController.updateUniversity(req, resp);
})

router.get('/university/:_id', (req, resp)=>{
    UniversityController.findUniversity(req, resp);
})

router.get('/university', (req, resp)=>{
    UniversityController.findAllUniversities(req, resp);
})

router.delete('/university/:_id', (req, resp)=>{
    UniversityController.deleteUniversity(req, resp);
})

router.get('/university/:_id/schools', (req, resp)=>{
    UniversityController.getUniversitySchools(req, resp);
})




/*************Schools endpoints ***********/
router.post('/school', (req, resp)=>{
    SchoolController.createSchool(req, resp);
})

router.put('/school', (req, resp)=>{
    SchoolController.updateSchool(req, resp);
})

router.get('/school/:_id', (req, resp)=>{
   SchoolController.findSchool(req, resp);
})

router.get('/school', (req, resp)=>{
    SchoolController.findAllSchools(req, resp);
})

router.delete('/school/:_id', (req, resp)=>{
   SchoolController.deleteSchool(req, resp);
})

router.get('/school/:_id/laboratories', (req, resp)=>{
    SchoolController.getSchoolLaboratories(req, resp);
})




/*************Laboratories endpoints ***********/
router.post('/laboratory', (req, resp)=>{
    LaboratoryController.createLaboratory(req, resp);
})

router.put('/laboratory', (req, resp)=>{
    LaboratoryController.updateLaboratory(req, resp);
})

router.get('/laboratory/:_id', (req, resp)=>{
   LaboratoryController.findLaboratory(req, resp);
})

router.get('/laboratory', (req, resp)=>{
    LaboratoryController.findAllLaboratorys(req, resp);
})

router.delete('/laboratory/:_id', (req, resp)=>{
   LaboratoryController.deleteLaboratory(req, resp);
})


module.exports = router;