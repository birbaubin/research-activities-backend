const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config');


const router = express.Router();


router.post('/signup', passport.authenticate('signup', { session : false }) , async (req, res, next) => {
    res.json({
      message : 'Signup successful',
      user : req.user
    });
  });
  

  router.post('/login', async (req, res, next) => {

    //console.log(req);
    passport.authenticate('login', async (err, user, info) => {     
        try {
        if(err || !user){

          return next(info);

        }
        req.login(user, { session : false }, async (error) => {
          if( error ) 
            return next(error)
          const body = { _id : user._id, email : user.email, role: user.role };
          const token = jwt.sign({ user : body },config.JWT_SECRET);
          let userInfos = {};
          Object.assign(userInfos, user._doc);
          delete userInfos.password;
          return res.json({ token: token, user: userInfos });
        });     
    } catch (error) {
        return next(error);
      }
    })(req, res, next);
  });


  
  module.exports = router;