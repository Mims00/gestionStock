const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Order = sequelize.define('Order', {
  orderId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  orderDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  deliveryAddress: {
    type: DataTypes.STRING,
    allowNull: true
  },
  deliveryCost: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  customerId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'customer', 
      key: 'customerId'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'userId'
    }
  },
  deliveryPersId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'deliveryperson', 
      key: 'deliveryPersId'
    }
  },
  discAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  finalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'orders',
  timestamps: false
});

module.exports = Order;
