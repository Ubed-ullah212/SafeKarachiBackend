const db = require("../config/connection");
const PostModel = db.PostModel;
const PostLikedModel = db.PostLikedModel;
const PostCommentModel = db.PostCommentModel;
const CommentLikesModel = db.CommentLikesModel;
const Trackerror = require("../middleware/TrackError");
const HandlerCallBack = require("../utils/HandlerCallBack");
const { Op, literal } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/Pagination");
const { upload } = require("../upload");
const { generateFileName } = require("../utils/FileNameGeneration");
exports.UnLikeComment = Trackerror(async (req, res, next) => {
  const data = await db.CommentLikesModel.destroy({
    where: {
      PostedId: req.params.id,
      UserId: req.user.user
    },
    force: true
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.LikedComment = Trackerror(async (req, res, next) => {
  const CommentData = await db.PostCommentModel.findOne({
    where: {
      id: req.params.id
    },
    attributes: ["id", "PostedId"]
  });
  if (!CommentData) {
    return next(new HandlerCallBack("comment not found", 404));
  }
  const data = await CommentLikesModel.findOrCreate({
    where: {
      PostedId: CommentData.PostedId,
      UserId: req.user.user,
      CommentId: req.params.id
    },
    default: {
      PostedId: CommentData.PostedId,
      UserId: req.user.user,
      CommentId: req.params.id
    }
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.LikePost = Trackerror(async (req, res, next) => {
  const data = await PostLikedModel.findOrCreate({
    where: {
      PostedId: req.params.id,
      UserId: req.user.user
    },
    default: {
      PostedId: req.params.id,
      UserId: req.user.user
    }
  });
  // const data = await PostLikedModel.create({
  //   PostedId: req.params.id,
  //   UserId: req.user.user,
  // });
  res.status(200).json({
    success: true,
    data
  });
});
exports.UnLikePost = Trackerror(async (req, res, next) => {
  const data = await PostLikedModel.destroy({
    where: {
      PostedId: req.params.id,
      UserId: req.user.user
    },
    force: true
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.CommentPost = Trackerror(async (req, res, next) => {
  const { Comment } = req.body;
  const data = await PostCommentModel.create({
    PostedId: req.params.id,
    UserId: req.user.user,
    Comment: Comment
  });
  res.status(200).json({
    success: true,
    data
  });
});
exports.CreatePost = Trackerror(async (req, res, next) => {
  const { Title, Description, Type, longitude, latitude } = req.body;
  const allowedFileTypes = ["image/jpeg", "image/png", "video/quicktime","video/mp4"];
  const file = req.files.Media;
  console.log("This is file"+file);

  if (file == null) {
    return next(new HandlerCallBack("Please upload an image", 404));
  }
  if (file !== null) {
    if (!allowedFileTypes.includes(req.files.Media.mimetype)) {
      return res.status(400).json({ error: "Invalid file type." });
    }
  }

  if (file == null) {
    return res.status(200).json({ message: "No File FOund." });
  }
  const Media = generateFileName();
  await upload(file, Media);
  
  const data = await PostModel.create({
    PostedBy: req.user.user,
    Image: `/uploads/${Media}.${file.mimetype.split("/")[1]}`,
    Title: Title,
    Description: Description,
    Type: Type,
    longitude: longitude,
    latitude: latitude
  });

  res.status(201).json({
    success: true,
    data,
    message: "Data Created Successfully"
  });
});

exports.EditPost = Trackerror(async (req, res, next) => {
  const { Title, Description, Type, longitude, latitude, Status } = req.body;

  let data = await PostModel.findOne({
    where: { id: req.params.id }
  });
  if (data === null) {
    return next(new HandlerCallBack("data not found", 404));
  }
  const updateddata = {
    Title: Title || data.Title,
    Description: Description || data.Description,
    Type: Type || data.Type,
    longitude: longitude || data.longitude,
    latitude: latitude || data.latitude,
    Status: Status || data.Status
  };
  const file = req?.files?.Media;
  console.log(file);

  if (file != null) {
    const Media = generateFileName();
    await upload(file, Media);
    updateddata["Image"] = `/uploads/${Media}.${file.mimetype.split("/")[1]}`;
  }
  data = await PostModel.update(updateddata, {
    where: {
      id: req.params.id
    }
  });
  res.status(200).json({
    success: true,

    message: "Data Updated Successfully"
  });
});
exports.SoftDeletePost = Trackerror(async (req, res, next) => {
  const data = await PostModel.findOne({
    where: { id: req.params.id }
  });
  if (!data) {
    return next(new HandlerCallBack("data not found", 404));
  }
  await PostModel.destroy({
    where: { id: req.params.id }
  });

  res.status(200).json({
    success: true,
    message: "Data Delete Successfully"
  });
});

// exports.GetPostListing = Trackerror(async (req, res, next) => {
//   const { page, size } = req.query;
//   const { limit, offset } = getPagination(page - 1, size);
//   await PostModel.findAndCountAll({
//     order: [["createdAt", "DESC"]],
//     // include: { all: true, nested: true },
//     where: {
//       [Op.and]: [
//         {
//           Type: {
//             [Op.like]: `%${req.query.Type || ""}%`
//           }
//         },
//         {
//           Description: {
//             [Op.like]: `%${req.query.Description || ""}%`
//           }
//         },
//         {
//           Title: {
//             [Op.like]: `%${req.query.Title || ""}%`
//           }
//         }
//       ]
//     },
//     attributes: [
//       "id",
//       "createdAt",
//       "Title",
//       "Description",
//       "longitude",
//       "latitude",
//       "Image"
//       [
//         literal(
//           `(select count(*) from postlikedmodel where PostedId=PostModel.id)`
//         ),
//         "likescount"
//       ]
//     ],
//     include: [
//       {
//         model: db.UserModel,
//         as: "PostedByData",
//         attributes: ["id", "Name"]
//       },
//       {
//         model: db.PostTypeModel,
//         as: "TypeData",
//         attributes: ["id", "Name"]
//       },
//       {
//         model: db.PostCommentModel,
//         as: "PostCommentData",
//         attributes: [
//           "id",
//           "Comment",
//           "createdAt",
//           [
//             literal(
//               `(select count(*) from CommentLikesModel where CommentId=PostCommentData.id)`
//             ),
//             "likescount"
//           ]
//         ],
//         include: [
//           {
//             model: db.UserModel,
//             as: "UserIdCommentData",
//             attributes: ["id", "Name"]
//           }
//         ]
//       }
//     ],
//     limit,
//     offset
//   })
//     .then((data) => {
//       const response = getPagingData(data, page, limit);
//       res.status(200).json({
//         success: true,
//         result: {
//           items: response.data,
//           pageNumber: response.currentPage,
//           pageSize: size || 11,
//           totalCount: response.totalcount,
//           totalPages: response.totalPages
//         }
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message:
//           err.message || "Some error occurred while retrieving Subscriptions."
//       });
//     });
// });

exports.GetPostListing = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await PostModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    // include: { all: true, nested: true },
    where: {
      [Op.and]: [
        {
          Type: {
            [Op.like]: `%${req.query.Type || ""}%`,
          },
        },
        {
          Description: {
            [Op.like]: `%${req.query.Description || ""}%`,
          },
        },
        {
          Title: {
            [Op.like]: `%${req.query.Title || ""}%`,
          },
        },
      ],
    },
    attributes: [
      "id",
      "createdAt",
      "Title",
      "Description",
      "longitude",
      "latitude",
      "Image",
      "Status",
      [
        literal(
          `(select count(*) from postlikedmodel where PostedId=PostModel.id)`
        ),
        "likescount",
      ],
    ],
    include: [
      {
        model: db.UserModel,
        as: "PostedByData",
        attributes: ["id", "Name","Image"],
      },
      {
        model: db.PostTypeModel,
        as: "TypeData",
        attributes: ["id", "Name"],
      },
      {
        model: db.PostCommentModel,
        as: "PostCommentData",
        attributes: [
          "id",
          "Comment",
          "createdAt",
          [
            literal(
              `(select count(*) from CommentLikesModel where CommentId=PostCommentData.id)`
            ),
            "likescount",
          ],
        ],
        include: [
          {
            model: db.UserModel,
            as: "UserIdCommentData",
            attributes: ["id", "Name","Image"],
          },
        ],
      },
    ],
    limit,
    offset,
  })
    .then((data) => {
      const response = getPagingData(data, page, limit);
      res.status(200).json({
        success: true,
        result: {
          items: response.data,
          pageNumber: response.currentPage,
          pageSize: size || 11,
          totalCount: response.totalcount,
          totalPages: response.totalPages,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        message:
          err.message || "Some error occurred while retrieving Subscriptions.",
      });
    });
});

