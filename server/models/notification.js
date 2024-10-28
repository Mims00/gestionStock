const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
    const Notification = sequelize.define('Notification', {
      notificationId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      statusNotif: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'non-lu',
      },
      relatedEntityId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      relatedEntityType: {
        type: DataTypes.STRING,
        allowNull: true,
      }
    }, {
      tableName: 'notifications',
      timestamps: false,
    });
  
    module.exports = Notification;
  
  