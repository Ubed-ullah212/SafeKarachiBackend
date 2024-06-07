const db = require("../config/connection");
const UserModel = db.UserModel;
const Trackerror = require("../middleware/TrackError");
const TokenCreation = require("../utils/TokenCreation");
const HandlerCallBack = require("../utils/HandlerCallBack");
const crypto = require("crypto");
const { Op } = require("sequelize");
const e = require("express");
const { upload } = require("../upload");
const { generateFileName } = require("../utils/FileNameGeneration");

exports.CreateUser = Trackerror(async (req, res, next) => {
  console.log(req.body);
  const { PhoneNumber, password, DOB, Email, Name} = req.body;
  // console.log(req);
  const allowedFileTypes = ["image/jpeg", "image/png"];
  const file = req?.files?.Media;
  console.log(file);

  let ImageRoute = null;

  if (file) {  
    if (!allowedFileTypes.includes(file.mimetype)) {
      return res.status(400).json({ error: "Invalid file type." });
    }

    const Media = generateFileName();
    await upload(file, Media);
    ImageRoute = `/uploads/${Media}.${file.mimetype.split("/")[1]}`;
  }



  try {
    const data = await UserModel.create({
      Name: Name,
     
      PhoneNumber: PhoneNumber,
      Image: ImageRoute,
      password: password,
      DOB: DOB,
      Email: Email,
    });
    console.log(data);
    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: true,
      err,
    });
  }
});

exports.SingleUser = Trackerror(async (req, res, next) => {
  console.log(req.user);
  const data = await db.UserModel.findOne({
    where: {
      id: req.user.user
    },
    attributes: ["id", "Name", "PhoneNumber", "DOB", "Email", "Image"],
    include: [
      {
        model: db.PostModel,
        as: "PostedByData",
        attributes: [
          "id",
          "Title",
          "Description",
          "Status",
          "longitude",
          "latitude",
          "Image",
          "createdAt"
        ],
        include: [
          {
            model: db.PostTypeModel,
            as: "TypeData",
            attributes: ["id", "Name"]
          }
        ]
      },
      {
        model: db.PostLikedModel,
        as: "UserLikedData",
        attributes: ["id"],
        include: [
          {
            model: db.PostModel,
            as: "PostLikedData",
            attributes: [
              "id",
              "Title",
              "Description",
              "Status",
              "longitude",
              "latitude",
              "Image",
              "createdAt"
            ],
            include: [
              {
                model: db.UserModel,
                as: "PostedByData",
                attributes: ["id", "Name", "Image"]
              }
            ]
          },
          {
            model: db.UserModel,
            as: "UserLikedData",
            attributes: ["id", "Name", "Image"]
          }
        ]
      },
      {
        model: db.PostCommentModel,
        as: "UserIdCommentData",
        attributes: ["id"],
        include: [
          {
            model: db.PostModel,
            as: "PostCommentData",
            attributes: [
              "id",
              "Title",
              "Description",
              "Status",
              "longitude",
              "latitude"
            ]
          }
        ]
      }
    ]
  });
  res.status(200).json({
    success: true,
    data
  });
});

exports.LoginUser = Trackerror(async (req, res, next) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return next(new HandlerCallBack("Please enter password and Email", 400));
  }

  const user = await UserModel.findOne({
    where: { [Op.and]: [{ Email: Email }, { password: password }] },
  });
  // if (user) {
  //   res.status(200).json({
  //     success: true,
  //     message: "Login Succesfull",
  //   });
  // } else {
  //   res.status(401).json({
  //     success: false,
  //     message: "Login Failed",
  //   });
  // }
  TokenCreation(user, 200, res);
});

exports.EditUser = Trackerror(async (req, res, next) => {
  const { PhoneNumber, password, DOB, Email, Name} = req.body;
  console.log(req.user);
  let data = await UserModel.findOne({
    where: { id: req.user.user },
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    Name: Name || data.Name,
    PhoneNumber: PhoneNumber || data.PhoneNumber,
    password: password || data.password,
    Email: Email || data.Email,
    DOB: DOB || data.DOB,
  };
  const file = req?.files?.Media;
  console.log(file);

  if (file !== null) {
    const Media = generateFileName();
    await upload(file, Media);
    updateddata["Image"] = `/uploads/${Media}.${file.mimetype.split("/")[1]}`;
  }

  data = await UserModel.update(updateddata, {
    where: {
      id: req.user.user,
    },
  });
  const sendData = await UserModel.findOne({
    where: { id: req.user.user },
  });
  res.status(200).json({
    success: true,
    message: "Data Updated Successfully",
    data: sendData,
  });
});


