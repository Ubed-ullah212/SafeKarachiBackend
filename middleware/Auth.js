const Trackerror = require("../middleware/TrackError");
const HandlerCallBack = require("../utils/HandlerCallBack");
const db = require("../config/connection");
const UserModel = db.UserModel;
const jwt = require("jsonwebtoken");
exports.VerifyUser = Trackerror(async (req, res, next) => {
  const token = req.header("authorization");

  if (!token) {
    return next(
      new HandlerCallBack("Please login to access this resource", 401)
    );
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findOne({
    where: {
      id: decodedData.id,
    },

    attributes: ["id"],
  });
  console.log(JSON.parse(JSON.stringify(user.id)));
  if (user) {
    req.user = {
      user: JSON.parse(JSON.stringify(user.id)),
    };
    next();
  } else {
    return next(
      new HandlerCallBack(
        "Invalid Token Kindly Login Again Or Enter Correct Credentials",
        401
      )
    );
  }
});
