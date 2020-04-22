const express = require('express');
const passport = require('passport');
const  UniversityController   = require('../controllers/UniversityController');
const SchoolController = require('../controllers/SchoolController');
const LaboratoryController = require('../controllers/LaboratoryController');
const UserController = require('../controllers/UserController');
const TeamController = require('../controllers/TeamController');
const authorise = require('../helpers/authorize')
const role = require('../helpers/role')
const statisticsHelper = require('../helpers/statistics');

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

router.get('/laboratory/:_id/teams', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    LaboratoryController.getTeamsOfLaboratory(req, resp);
})

router.get('/laboratory-of-head/:head_id', (req, resp)=>{
    LaboratoryController.getLaboratoryOfHead(req, resp);
})

router.get('/free-laboratories', (req, resp)=>{
    LaboratoryController.getFreeLaboratories(req, resp);
})

router.get('/entitle-laboratory/:head_id/:lab_id', (req, resp)=>{
    LaboratoryController.associateHeadToLaboratory(req, resp)
})





/*************users endpoints ***********/
router.post('/user', authorise([role.CED_HEAD, role.LABORATORY_HEAD]),(req, resp)=>{
    UserController.createUser(req, resp);
})

router.put('/user',(req, resp)=>{
    UserController.updateUser(req, resp);
})

router.get('/user/:_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]),(req, resp)=>{
   UserController.findUser(req, resp);
})

router.get('/user', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    UserController.findAllUsers(req, resp);
})

router.delete('/user/:_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
   UserController.deleteUser(req, resp);
})

router.post('/user/:_id/update-password', (req, resp)=>{
    UserController.updatePassword(req, resp);
})

router.get('/lab-heads', (req, resp)=>{
    UserController.getLabHeads(req, resp);
})





/****************Followed users endpoints  ********/

router.post('/follow', (req, resp)=>{
    UserController.followUser(req, resp);
})

router.get('/unfollow/:_id', (req, resp)=>{
    UserController.unfollowUser(req, resp);
})


router.get('/is-following/:name', (req, resp)=>{
    UserController.isFollowing(req, resp);
})

router.get('/followed-users', (req, resp)=>{
    UserController.getFollowedUsers(req, resp);
})






/*****************Teams endpoints **************/
router.post('/team', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.createTeam(req, resp);
})

router.put('/team', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.updateTeam(req, resp);
})

router.get('/team', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.findAllTeams(req, resp);
})

router.get('/team/:_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.findTeam(req, resp);
})

router.delete('/team/:_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.deleteTeam(req, resp);
})

router.get('/add-to-team/:team_id/:user_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.addUserToTeam(req, resp);
})

router.get('/remove-from-team/:team_id/:user_id', authorise([role.CED_HEAD, role.LABORATORY_HEAD]), (req, resp)=>{
    TeamController.removeFromTeam(req, resp);
})


router.get('/statistics', (req, resp)=>{
    statisticsHelper.getStatistics(req, resp);
})


module.exports = router;