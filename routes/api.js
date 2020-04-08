const express = require('express');
const passport = require('passport');
const  UniversityController   = require('../controllers/UniversityController');
const SchoolController = require('../controllers/SchoolController');
const LaboratoryController = require('../controllers/LaboratoryController');
const UserController = require('../controllers/UserController');
const authorise = require('../helpers/authorize')
const role = require('../helpers/role')


const router = express.Router();
router.get('/', (req, res)=>{
    res.send("Research app REST API working  !");
})



//TODO: change naming convention

/*************Universities endpoints ***********/
router.post('/university', authorise([role.CED_HEAD]), (req, resp)=>{
    UniversityController.createUniversity(req, resp);
})

router.put('/university', authorise([role.CED_HEAD]), (req, resp)=>{
    UniversityController.updateUniversity(req, resp);
})

router.get('/university/:_id', authorise([role.CED_HEAD]), (req, resp)=>{
    UniversityController.findUniversity(req, resp);
})

router.get('/university', authorise([role.CED_HEAD]), (req, resp)=>{
    UniversityController.findAllUniversities(req, resp);
})

router.delete('/university/:_id', authorise([role.CED_HEAD]),(req, resp)=>{
    UniversityController.deleteUniversity(req, resp);
})

router.get('/university/:_id/schools', (req, resp)=>{
    UniversityController.getUniversitySchools(req, resp);
})




/*************Schools endpoints ***********/
router.post('/school', authorise([role.CED_HEAD]),(req, resp)=>{
    
    SchoolController.createSchool(req, resp);
})

router.put('/school', authorise([role.CED_HEAD]),(req, resp)=>{
    SchoolController.updateSchool(req, resp);
})

router.get('/school/:_id', authorise([role.CED_HEAD]),(req, resp)=>{
   SchoolController.findSchool(req, resp);
})

router.get('/school', authorise([role.CED_HEAD]),(req, resp)=>{
    SchoolController.findAllSchools(req, resp);
})

router.delete('/school/:_id', authorise([role.CED_HEAD]),(req, resp)=>{
   SchoolController.deleteSchool(req, resp);
})

router.get('/school/:_id/laboratories', authorise([role.CED_HEAD]),(req, resp)=>{
    SchoolController.getSchoolLaboratories(req, resp);
})




/*************Laboratories endpoints ***********/
router.post('/laboratory', authorise([role.CED_HEAD, role.LABORATORY_HEAD]),(req, resp)=>{
    LaboratoryController.createLaboratory(req, resp);
})

router.put('/laboratory', authorise([role.CED_HEAD, role.LABORATORY_HEAD]),(req, resp)=>{
    LaboratoryController.updateLaboratory(req, resp);
})

router.get('/laboratory/:_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD, role.SEARCHER_HEAD]),(req, resp)=>{
   LaboratoryController.findLaboratory(req, resp);
})

router.get('/laboratory', authorise([role.CED_HEAD, role.LABORATORY_HEAD]),(req, resp)=>{
    LaboratoryController.findAllLaboratorys(req, resp);
})

router.delete('/laboratory/:_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]),(req, resp)=>{
   LaboratoryController.deleteLaboratory(req, resp);
})


/*************users endpoints ***********/
router.post('/user', (req, resp)=>{
    UserController.createUser(req, resp);
})

router.put('/user', (req, resp)=>{
    UserController.updateUser(req, resp);
})

router.get('/user/:_id', (req, resp)=>{
   UserController.findUser(req, resp);
})

router.get('/user', (req, resp)=>{
    UserController.findAllUsers(req, resp);
})

router.delete('/user/:_id', (req, resp)=>{
   UserController.deleteUser(req, resp);
})


/****************Followed users endpoints  ********/

router.post('/follow', (req, resp)=>{
    UserController.followUser(req, resp);
})

router.get('/is-following/:name', (req, resp)=>{
    UserController.isFollowing(req, resp);
})


/**********Test endpoint ***************/

module.exports = router;