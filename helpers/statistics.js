const FollowedUser = require("../models/followed-user");
const University = require("../models/university");
const School = require("../models/school");
const Laboratory = require("../models/laboratory");

exports.getStatistics = function (req, resp) {

  let years = [];
  let statistic = null;
  for (let i = req.query.start; i <= req.query.end; i++) years.push(i);

  FollowedUser.find({}, "name id publications")
    .then((followedUsers) => {
      followedUsers.forEach((user) => {
        let publicationsStatistics = {};
        years.forEach((year) => {
          let numberOfPublication = 0;
          user.publications.forEach((publication) => {
            if (publication.bib.year == year) numberOfPublication++;
          });

          publicationsStatistics[year] = numberOfPublication;
        });
        user._doc.publicationStatistics = publicationsStatistics;
        delete user._doc.publications;
      });
     resp.send(followedUsers);
    })
    .catch((error) => {
      resp.status(500).send(error);
      console.log(error);
    });

    return statistic;
    
}


exports.getAllStatistics = async function(req, resp){

  try{
    let stats = await Promise.all([getNumberOfLabsPerSchool(), 
      getNumberOfPublicationsPerUser(req.query.start, req.query.end), 
      getNumberOfLabsPerUniv()]);
    console.log(stats);
    resp.send({numberOfLabsPerSchool: stats[0], numberOfLabsPerUniv: stats[2], numberOfPublicationsPerUser: stats[1]});
  }
  catch(error){
  resp.status(500).send(error);
  }
 
}


async function getNumberOfPublicationsPerUser(start, end){
  let years = [];
  let statistic = null;
  for (let i = start; i <= end; i++) years.push(i);

  await FollowedUser.find({}, "name id publications")
    .then((followedUsers) => {
      followedUsers.forEach((user) => {
        let publicationsStatistics = {};
        years.forEach((year) => {
          let numberOfPublication = 0;
          user.publications.forEach((publication) => {
            if (publication.bib.year == year) numberOfPublication++;
          });

          publicationsStatistics[year] = numberOfPublication;
        });
        user._doc.publicationStatistics = publicationsStatistics;
        delete user._doc.publications;
      });
     statistic = followedUsers;
    })
    .catch((error) => {
      throw error;
      console.log(error);
    });

    return statistic;
}



 async function getNumberOfLabsPerUniv(){
  
  let statistic = null;
  await University.find()
      .then((universities) =>
        Promise.all(
          universities.map(async (university) => {
            let numberOfLabs = 0;
            const schools = await School.find({
              university_id: university._id,
            }).then((schools) =>
              Promise.all(
                schools.map( async (school)=>{
                  numberOfLabs += await Laboratory.countDocuments({school_id: school.id});
                })
              )
            );

            return {
              ...university._doc,
              numberOfLabs: numberOfLabs
            };
          })
        )
      )
      .then(stat=>{
        statistic = stat;
      })
      .catch(error=>{
       throw error;
       console.log(error);
      })

      return statistic;
}

async function getNumberOfLabsPerSchool(){
  let statistic = null;
  await School.find()
      .then((schools) =>
        Promise.all(
          schools.map(async (school) => {
            let numberOfLabs = 0;
             numberOfLabs += await Laboratory.countDocuments({
              school_id: school._id,
            })
            return {
              ...school._doc,
              numberOfLabs: numberOfLabs
            };
          })
        )
      )
      .then(stat=>{
        statistic = stat;
      })
      .catch(error=>{
        throw error;
        console.log(error);
      })

      return statistic;
}


