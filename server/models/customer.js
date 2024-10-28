const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./order');

const Customer = sequelize.define('Customer', {
  customerId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: true 
 },
  address: {
    type: DataTypes.STRING,
    allowNull:true
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName:'customers',
  timestamps: false
});

module.exports=Customer;