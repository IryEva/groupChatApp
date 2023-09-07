const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Group = sequelize.define('group',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    groupName: Sequelize.STRING,
    createdBy: Sequelize.STRING
    
});  

module.exports = Group;