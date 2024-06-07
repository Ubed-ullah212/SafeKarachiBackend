const db = require("../config/connection");
const PostTypeModel = db.PostTypeModel;
const Trackerror = require("../middleware/TrackError");
const HandlerCallBack = require("../utils/HandlerCallBack");
// const { Op } = require("sequelize");
const { getPagination, getPagingData } = require("../utils/Pagination");

exports.CreatePostType = Trackerror(async (req, res, next) => {
  const { Name } = req.body;

  const data = await PostTypeModel.create({
    Name: Name,
  });

  res.status(201).json({
    success: true,
    data,
    message: "Data Created Successfully",
  });
});

exports.GetPostTypeListing = Trackerror(async (req, res, next) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page - 1, size);
  await PostTypeModel.findAndCountAll({
    order: [["createdAt", "DESC"]],

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
