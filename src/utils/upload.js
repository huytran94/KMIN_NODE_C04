import multer from "multer";
import pathResolve from "../pathHandler.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/assets/uploads");
  },
  filename: function (req, file, cb) {
    let newFileName = `${Date.now()}-${file.originalname}`;
    cb(null, newFileName);
  },
});

const upload = multer({ storage });

export default upload;
