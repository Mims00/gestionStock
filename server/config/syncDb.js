const sequelize = require('./db');
const syncDb = async () => {
    try {
        await sequelize.sync({ force: false }); 
        console.log('database synhronisation success');
    } catch (err) {
        console.error('database synhronisation error :', err);
    }
};

module.exports= syncDb;
