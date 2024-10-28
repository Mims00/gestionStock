const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const DeliveryPerson = sequelize.define('DeliveryPerson', {
    deliveryPersId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    deliveryPersName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deliveryPersPhone: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'deliveryperson',
    timestamps: false
  });
  
  module.exports =  DeliveryPerson;