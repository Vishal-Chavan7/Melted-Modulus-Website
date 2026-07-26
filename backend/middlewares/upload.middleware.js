import multer from "multer";
import path from "path";
import ApiError from "../utils/ApiError.js";

const storage = multer.memoryStorage();

const imageFilter = (_req, file, cb) => {
  const allowed = /jpeg|jpg|png|webp|gif/;
  const isValidExt = allowed.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowed.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
    return;
  }

  cb(new ApiError(400, "Only image files (jpg, png, webp, gif) are allowed"));
};

export const uploadProductImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 5,
  },
}).array("images", 5);

export const handleProductUpload = (req, res, next) => {
  uploadProductImages(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(
        new ApiError(
          400,
          err.code === "LIMIT_FILE_SIZE" ? "Image must be under 5MB" : err.message,
        ),
      );
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

export const parseExistingImages = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};
