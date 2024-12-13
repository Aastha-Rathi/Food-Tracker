const express = require("express");
const router = express.Router();
const { imageUpload } = require("../controllers/imageController"); // Import the controller
const { upload, multerErrorHandler } = require("../utils/multer");

router.post(
    "/image-upload",
    (req, res, next) => {
        console.log("Headers:", req.headers);
        console.log("Body:", req.body);
        next();
    },
    upload.single("image"),
    (req, res, next) => {
        console.log("File after multer:", req.file); // Check multer output
        next();
    },
    multerErrorHandler,
    imageUpload
);


  
  


module.exports = router;