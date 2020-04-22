const dotenv = require('dotenv');
dotenv.config();
const fileupload = require('express-fileupload');
const express = require('express');
const cors = require('cors')
const api = require('./routes/api');
const mongoose = require('mongoose');
const config = require('./config');
const passport = require('passport');
const path = require('path');


const app = express();
app.use(express.json());
app.use(cors())
mongoose.connect(config.MONGODB_URI);
mongoose.Promise = global.Promise;
require('./auth/auth');


app.listen(config.PORT, ()=>{
    console.log(`Server started on port ${config.PORT}`);
});

app.use(fileupload());
app.use("/pictures", express.static(__dirname+'/public/images'));

app.use('/api', passport.authenticate('jwt', { session : false }), require('./routes/api'));
app.use('/auth', require('./routes/auth'))

app.get('/test', (req, resp)=>{
    const token = req.headers.authorization.split(' ')[1];
    resp.send(jwt.decode(token));
    
})