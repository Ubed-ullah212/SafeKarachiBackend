const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PostCommentModel = sequelize.define(
    "PostCommentModel",
    //dob address
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
      Comment: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  return PostCommentModel;
};
