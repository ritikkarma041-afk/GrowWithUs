// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './storage/data.db'
// });
// module.exports = sequelize;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME || 'growithusv1',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'Ritik@123',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false, // set true if you want SQL logs
  }
);

module.exports = sequelize;