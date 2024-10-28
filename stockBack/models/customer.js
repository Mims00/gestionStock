const Order = require('./order');
const { Sequelize, DataTypes } = require("sequelize");



const sequelize = new Sequelize("gestionstock", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

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