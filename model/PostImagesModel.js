const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PostImagesModel = sequelize.define(
    "PostImagesModel",
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
      Images: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  return PostImagesModel;
};
