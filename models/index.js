const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models and define associations
db.User = require('./user.js')(sequelize, Sequelize);
db.Post = require('./post.js')(sequelize, Sequelize);
db.Comment = require('./comment.js')(sequelize, Sequelize);

// Define associations
db.User.hasMany(db.Post);
db.Post.belongsTo(db.User);

db.User.hasMany(db.Comment);
db.Comment.belongsTo(db.User);
db.Post.hasMany(db.Comment);
db.Comment.belongsTo(db.Post);

module.exports = db;
