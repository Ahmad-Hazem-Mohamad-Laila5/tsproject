import express from "express";
import multer from "multer";
import auth from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";

const uploadRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

uploadRouter.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }

    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/jpg",
    ];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ message: "Only image files are allowed" });
    }

    const base64Image = Buffer.from(req.file.buffer).toString("base64");
    const dataUri = `data:${req.file.mimetype};base64,${base64Image}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: "tsnew",
      resource_type: "auto",
    });

    return res.json({ url: result.secure_url });
  } catch (error: any) {
    console.error("Cloudinary upload failed:", error?.message);
    return res.status(500).json({
      message: error?.message || "Image upload failed",
    });
  }
});

export default uploadRouter;
