const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dewini', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    // Test query to verify database access
    const [results] = await sequelize.query('SHOW TABLES');
    console.log('Available tables:', results);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

testConnection();

module.exports = sequelize;
