import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(16).toString("hex");
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const IMAGE_MIME = ["image/jpeg", "image/png", "image/webp"];
const IMAGE_EXT = [".jpg", ".jpeg", ".png", ".webp"];

const PDF_MIME = ["application/pdf"];
const PDF_EXT = [".pdf"];

const makeFilter = (allowedMime, allowedExt) => (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedMime.includes(file.mimetype) || !allowedExt.includes(ext)) {
    return cb(new Error("Format non supporté"));
  }
  cb(null, true);
};

export const uploadAvatar = multer({
  storage,
  fileFilter: makeFilter(IMAGE_MIME, IMAGE_EXT),
  limits: { fileSize: 2 * 1024 * 1024 },
});

export const uploadCV = multer({
  storage,
  fileFilter: makeFilter(PDF_MIME, PDF_EXT),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadLogo = multer({
  storage,
  fileFilter: makeFilter(IMAGE_MIME, IMAGE_EXT),
  limits: { fileSize: 2 * 1024 * 1024 },
});
