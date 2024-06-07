const Sequelize = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
module.exports = (sequelize, DataTypes) => {
  const UserModel = sequelize.define(
    "UserModel",
    
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      Name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add FirstName Of User" },
          notEmpty: {
            msg: "Without FirstName User Will not get submitted"
          }
        }
      },
      
      Image: {
        type: DataTypes.STRING
      },

      PhoneNumber: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },

      DOB: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          notNull: { msg: "Please Add Date of birth Of User" },
          notEmpty: {
            msg: "Without Date of birth User Will not get submitted"
          }
        }
      },

      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        isEmail: true,
        unique: true
      }

      // TokenDate: {
      //   type: DataTypes.DATE,
      // },
    },
    {
      freezeTableName: true,
      paranoid: true
    }
  );

  UserModel.prototype.getJWTToken = function () {
    return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });
  };

  UserModel.prototype.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };

 
  {
    Hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, "a");
          user.password = bcrypt.hashSync(user.password, salt);
        }
      };
    }
  }
  return UserModel;
};













// type: Sequelize.INTEGER,
//autoIncrement: true,

//
// UserModel.prototype.hash(async function (next) {
//   this.password = await bcrypt.hash(this.password, 10);
// });
