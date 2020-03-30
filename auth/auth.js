const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user');
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const config = require('../config');
const roles = require('../helpers/role')


passport.use('signup', new localStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
    try {
      const rolesArray  = [roles.CED_HEAD, roles.LABORATORY_HEAD, roles.SEARCHER]
      if(!rolesArray.includes(req.body.role)){
        console.log("error occured")
        
      }
        
      const { firstName, lastName, role} = req.body;

      console.log(firstName, lastName, role);
      const user = await UserModel.create({ firstName, lastName, email, password, role});
      return done(null, user);
    } catch (error) {
      done(error);
    }
}));




passport.use('login', new localStrategy({
  usernameField : 'email',
  passwordField : 'password'
}, async (email, password, done) => {
  try {
    let user = await UserModel.findOne({ email });
    if( !user ){
     
      return done(null, false, { message : 'User not found'});
    }
   
    const validate = await user.isValidPassword(password);
    if( !validate ){
      return done(null, false, { message : 'Wrong Password'});
    }
   
    return done(null, user, { message : 'Logged in Successfully'});
  } catch (error) {
    return done(error);
  }
}));


passport.use(new JWTstrategy({
 
  secretOrKey : config.JWT_SECRET,
  jwtFromRequest : ExtractJWT.fromAuthHeaderWithScheme('Bearer')
}, async (token, done) => {
  try {
    return done(null, token.user);
  } catch (error) {
    done(error);
  }
}));