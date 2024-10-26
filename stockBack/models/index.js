const sequelize = require('../config/db');
const Product = require('./product');
const Customer = require('./customer');
const User = require('./user')(sequelize);
const DeliveryPerson = require('./deliveryPerson');
const Order = require('./order');
const OrderLine = require('./orderLine');
const Notification = require('./notification');

// Définir les associations
// Association entre Customer et Order
Customer.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
Order.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });

// Association entre DeliveryPerson et Order
DeliveryPerson.hasMany(Order, { foreignKey: 'deliveryPersId', as: 'orders' });
Order.belongsTo(DeliveryPerson, { foreignKey: 'deliveryPersId', as: 'deliveryPerson' });

// Association entre User et Order
User.hasMany(Order, { foreignKey: 'userId', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Association entre Order et OrderLine
Order.hasMany(OrderLine, { foreignKey: 'orderId', as: 'orderLines' });
OrderLine.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });

// Association entre Product et OrderLine
Product.hasMany(OrderLine, { foreignKey: 'productId', as: 'orderLines' });
OrderLine.belongsTo(Product, { foreignKey: 'productId', as: 'product' });




module.exports = {
    sequelize,
    Product,
    Customer,
    User,
    DeliveryPerson,
    Order,
    OrderLine,
    Notification,
};
