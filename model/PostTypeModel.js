const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PostTypeModel = sequelize.define(
    "PostTypeModel",
    //dob address
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      Name: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  return PostTypeModel;
};
