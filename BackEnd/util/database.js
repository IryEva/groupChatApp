const Sequelize = require('sequelize');

const sequelize = new Sequelize('groupchat','root','nivya@333', {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize; 