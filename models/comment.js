module.exports = function (sequelize, DataTypes) {
    const Comment = sequelize.define('Comment', {
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    Comment.associate = (models) => {
      Comment.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
      Comment.belongsTo(models.Post, {
        foreignKey: {
          allowNull: false,
        },
      });
    };
  
    return Comment;
  };
  