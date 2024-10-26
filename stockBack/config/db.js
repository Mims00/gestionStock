const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('gestionStock', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  logging:true, 
});

module.exports = sequelize;
