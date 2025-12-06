import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Log for debugging
  console.log("Multer processing file:", file.originalname, "Field:", file.fieldname);

  if (file.fieldname === "video") {
    if (!file.mimetype.startsWith("video/")) {
      return cb(new Error("File must be a video"), false);
    }
  } else if (file.fieldname === "thumbnail" || file.fieldname === "avatar" || file.fieldname === "coverImage") {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("File must be an image"), false);
    }
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter
});