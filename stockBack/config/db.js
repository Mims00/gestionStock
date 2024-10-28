const Sequelize = require("sequelize");

const sequelize = new Sequelize("gestionstock", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

// Test the connection
sequelize.authenticate()
    .then(() => console.log('Database connection established'))
    .catch(err => console.error('Unable to connect to the database:', err));

module.exports = sequelize;
