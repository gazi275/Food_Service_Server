import {v2 as cloudinary} from "cloudinary";

import config from "../config";


cloudinary.config({
    api_key:config.api_key,
    api_secret:config.api_secret,
    cloud_name:config.api_name,
 
})
cloudinary.uploader.upload("./test-image.jpg", (error, result) => {
    if (error) {
      console.error("Cloudinary error:", error);
    } else {
      console.log("Cloudinary result:", result);
    }
  });

export default cloudinary;