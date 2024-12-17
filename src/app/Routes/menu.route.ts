import express from "express" 
import { isAuthenticated } from "../middleware/isAuthenticate";
import upload from "../middleware/multer";
import { addMenu, editMenu } from "../contoller/menu.controller";


const router = express.Router();

router.route("/").post(isAuthenticated, upload.single("image"), addMenu);
router.route("/:id").put(isAuthenticated, upload.single("image"), editMenu);
 
export const menuroutes= router;                                                                    


