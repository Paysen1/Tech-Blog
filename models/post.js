module.exports = function (sequelize, DataTypes) {
    const Post = sequelize.define('Post', {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    });
  
    Post.associate = (models) => {
      Post.belongsTo(models.User, {
        foreignKey: {
          allowNull: false,
        },
      });
      Post.hasMany(models.Comment, {
        onDelete: 'CASCADE',
      });
    };
  
    return Post;
  };
  