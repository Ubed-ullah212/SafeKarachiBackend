const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config({ path: "./config/Secrets.env" });

const Db = new Sequelize(
  process.env.SQLDB,
  process.env.SQLHOST,
  process.env.SQLPASSWORD,
  {
    dialect: "mysql",
  }
);
Db.authenticate()
  .then(() => {
    console.log("connected..");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = Db;
db.UserModel = require("../model/UserModel")(Db, DataTypes);
db.CommentLikesModel = require("../model/CommentLikesModel")(Db, DataTypes);
db.PostModel = require("../model/PostModel")(Db, DataTypes);
db.PostTypeModel = require("../model/PostTypeModel")(Db, DataTypes);
db.PostImagesModel = require("../model/PostImagesModel")(Db, DataTypes);
db.PostLikedModel = require("../model/PostLikedModel")(Db, DataTypes);
db.PostCommentModel = require("../model/PostCommentModel")(Db, DataTypes);
db.sequelize.sync({ force: false, alter: false }).then(() => {
  console.log("yes re-sync done!"); //sync kiya database sschema ke sath
});
db.PostCommentModel.hasMany(db.CommentLikesModel, {
  foreignKey: "CommentId",
  as: "PostedCommentedCommentLikeData",
});
db.CommentLikesModel.belongsTo(db.PostCommentModel, {
  foreignKey: "CommentId",
  as: "PostedCommentedCommentLikeData",
});
db.PostModel.hasMany(db.CommentLikesModel, {
  foreignKey: "PostedId",
  as: "PostedCommentLikeData",
});
db.CommentLikesModel.belongsTo(db.PostModel, {
  foreignKey: "PostedId",
  as: "PostedCommentLikeData",
});
db.UserModel.hasMany(db.CommentLikesModel, {
  foreignKey: "UserId",
  as: "CommentLikeData",
});
db.CommentLikesModel.belongsTo(db.UserModel, {
  foreignKey: "UserId",
  as: "CommentLikeData",
});

db.UserModel.hasMany(db.PostModel, {
  foreignKey: "PostedBy",
  as: "PostedByData",
});
db.PostModel.belongsTo(db.UserModel, {
  foreignKey: "PostedBy",
  as: "PostedByData",
});
db.PostTypeModel.hasMany(db.PostModel, {
  foreignKey: "Type",
  as: "TypeData",
});
db.PostModel.belongsTo(db.PostTypeModel, {
  foreignKey: "Type",
  as: "TypeData",
});
db.PostImagesModel.belongsTo(db.PostModel, {
  foreignKey: "PostedId",
  as: "PostedIdData",
});
db.PostModel.hasMany(db.PostImagesModel, {
  foreignKey: "PostedId",
  as: "PostedIdData",
});
db.PostLikedModel.belongsTo(db.PostModel, {
  foreignKey: "PostedId",
  as: "PostLikedData",
});
db.PostModel.hasMany(db.PostLikedModel, {
  foreignKey: "PostedId",
  as: "PostLikedData",
});
db.PostLikedModel.belongsTo(db.UserModel, {
  foreignKey: "UserId",
  as: "UserLikedData",
});
db.UserModel.hasMany(db.PostLikedModel, {
  foreignKey: "UserId",
  as: "UserLikedData",
});
db.PostCommentModel.belongsTo(db.PostModel, {
  foreignKey: "PostedId",
  as: "PostCommentData",
});
db.PostModel.hasMany(db.PostCommentModel, {
  foreignKey: "PostedId",
  as: "PostCommentData",
});
db.PostCommentModel.belongsTo(db.UserModel, {
  foreignKey: "UserId",
  as: "UserIdCommentData",
});
db.UserModel.hasMany(db.PostCommentModel, {
  foreignKey: "UserId",
  as: "UserIdCommentData",
});

module.exports = db;
