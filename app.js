const path = require('path');

const express = require('express');
const bodyParser = require('body-parser'); //parse request body and make it available in req.body object

//const errorController = require('./controllers/error');

const fs = require('fs');  
var cors = require('cors');

const app = express();
app.use(cors({
  origin: "*",
 })
); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

const sequelize = require('./BackEnd/util/database');


const userRoutes = require('./BackEnd/routes/user'); 
//const User = require('./models/user');

app.use('/user', userRoutes);
app.use(express.json());
//app.use(express.static(path.join(__dirname, 'public'))); 

sequelize.sync().then(result => {
  app.listen(3000);
}).catch(err => {
  console.log(err);
})