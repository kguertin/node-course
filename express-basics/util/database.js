const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Node1234!', {
  dialect: 'mysql',
  host: 'localhost'
}); // creates connection pool

module.exports = sequelize