const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const CommentLikesModel = sequelize.define(
    "CommentLikesModel",
   
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      PostedId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      UserId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      CommentId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  return CommentLikesModel;
};
