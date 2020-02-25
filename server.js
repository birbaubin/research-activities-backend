const express = require('express');
const api = require('./routes/api');
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('passport');


const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost/research-activities');
mongoose.Promise = global.Promise;
require('./auth/auth');


app.listen(config.PORT, ()=>{
    console.log(`Server started on port ${config.PORT}`);
});


app.use('/api', passport.authenticate('jwt', { session : false }), require('./routes/api'));
app.use('/auth', require('./routes/auth'))