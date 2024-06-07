const Sequelize = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const PostModel = sequelize.define(
    "PostModel",
    //dob address
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      PostedBy: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Image: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Type: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      Status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      longitude: {
        type: DataTypes.DOUBLE(11, 8),
        allowNull: false,
        validate: {
          LongitudeAndLatitudeVerification() {
            if (this.longitude == "") {
              throw new Error("Please Enter longitude ");
            }
            if (
              /^-?([0-9]{1,2}|1[0-7][0-9]|180)(.[0-9]{1,15})$/.test(
                this.longitude
              )
            ) {
            } else {
              throw new Error("longitude Verification Failed");
            }
          },
        },
      },
      latitude: {
        type: DataTypes.DOUBLE(11, 8),
        allowNull: false,
        validate: {
          LongitudeAndLatitudeVerification() {
            if (this.latitude == "") {
              throw new Error("Please Enter latitude");
            }
            if (/^-?([0-8]?[0-9]|90)(.[0-9]{1,15})$/.test(this.latitude)) {
            } else {
              throw new Error("Latitude Verification Failed");
            }
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
    }
  );

  return PostModel;
};

// PostModel.prototype.hash(async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
// });
