const FollowedUser = require("../models/followed-user");

exports.getStatistics = function(req, resp){


    let years = [];
    for(let i = req.query.start; i<=req.query.end; i++)
        years.push(i);
    

    FollowedUser.find()
                .then(followedUsers=>{
                    followedUsers.forEach(user=>{
                        let publicationsStatistics = {};
                        years.forEach(year=>{
                            let numberOfPublication = 0;
                            user.publications.forEach(publication=>{
                                if(publication.bib.year==year)
                                    numberOfPublication++;
                            })

                            publicationsStatistics[year] = numberOfPublication;
                    
                        })
                        user._doc.publicationStatistics = publicationsStatistics;
                        delete user._doc.publications;
                    })
                    resp.send(followedUsers);
                })
                .catch(error=>{
                    resp.status(500).send(error);
                    console.log(error);
                })
}