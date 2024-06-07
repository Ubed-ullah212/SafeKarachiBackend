const path = require("path");
const upload = async (uploadedFile, ImageName) => {
  const uploadPath = path.join(
    __dirname,
    `uploads/${ImageName}.${uploadedFile.mimetype.split("/")[1]}`
  );
  console.log(uploadPath);

  try {
    await new Promise((resolve, reject) => {
      uploadedFile.mv(uploadPath, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(uploadPath);
        }
      });
    });

    console.log("File uploaded successfully.");
    return uploadPath;
  } catch (err) {
    console.error("Error uploading file:", err);
    throw err;
  }
};
module.exports = {
  upload,
};
