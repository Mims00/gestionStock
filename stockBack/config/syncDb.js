const sequelize = require('./db');

const syncDb = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established successfully');
        
        await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
        console.log('Database synchronization successful');
    } catch (err) {
        console.error('Database synchronization error:', err);
    }
};

module.exports = syncDb;
