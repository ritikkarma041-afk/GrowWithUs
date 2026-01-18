// const { Sequelize } = require('sequelize');
// const sequelize = new Sequelize({
//   dialect: 'sqlite',
//   storage: './storage/data.db'
// });
// module.exports = sequelize;

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT || 5432,
    logging: false, // set true if you want SQL logs

    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
);

module.exports = sequelize;
