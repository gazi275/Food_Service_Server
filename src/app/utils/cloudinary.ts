import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import config from "../config";
dotenv.config();

cloudinary.config({
    api_key:config.api_key,
    api_secret:config.api_secret,
    cloud_name:config.api_name
})

export default cloudinary;