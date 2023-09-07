const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const UserGroup = sequelize.define('user_group', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    isAdmin: Sequelize.BOOLEAN,
  });
  
  module.exports = UserGroup;
