const express = require('express');
const cors = require('cors')
const api = require('./routes/api');
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('passport');


const app = express();
app.use(express.json());
app.use(cors())
mongoose.connect('mongodb://heroku_1b8nz662:hpueci1942ulml4c9h1runn5qk@ds113826.mlab.com:13826/heroku_1b8nz662');
mongoose.Promise = global.Promise;
require('./auth/auth');


app.listen(config.PORT, ()=>{
    console.log(`Server started on port ${config.PORT}`);
});


app.use('/api', passport.authenticate('jwt', { session : false }), require('./routes/api'));
app.use('/auth', require('./routes/auth'))