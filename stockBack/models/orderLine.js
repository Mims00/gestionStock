const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order= require('./order');
const Product= require('./product');
const OrderLine = sequelize.define('OrderLine', {
  orderLineId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  qty: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  orderId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Order',
      key: 'orderId'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Product',
      key: 'productId'
    }
  }
}, {
  tableName: 'orderlines',
  timestamps: false
});


module.exports = OrderLine;
