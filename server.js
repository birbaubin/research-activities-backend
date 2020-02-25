const express = require('express');
const api = require('./routes/api');
const mongoose = require('mongoose');
const config = require('./config');


const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost/research-activities');
mongoose.Promise = global.Promise;

app.listen(config.PORT, ()=>{
    console.log(`Server started on port ${config.PORT}`);


});


app.use('/api', require('./routes/api'));