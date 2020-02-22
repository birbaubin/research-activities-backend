const express = require('express');
const api = require('./routes/api');
const mongoose = require('mongoose');


const app = express();
app.use(express.json());
mongoose.connect('mongodb://localhost/research-activities');
mongoose.Promise = global.Promise;

const port = process.env.PORT || 8080;
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
});


app.use('/api', require('./routes/api'));