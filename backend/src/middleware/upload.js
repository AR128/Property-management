import multer from "multer";
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|jpg)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

export const propertyUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 8 },
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpeg|png|jpg|webp)$/.test(file.mimetype)) cb(null, true);
    else cb(new Error("Property images must be JPG, PNG, or WebP files."));
  },
});
