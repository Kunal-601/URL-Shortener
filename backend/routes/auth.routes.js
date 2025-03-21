import express from "express";
import { loginUser, logoutUser, registerUser, updateUser } from "../controllers/auth.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/verifyJWT.middleware.js";

const router = express.Router();


router.post("/register",upload.single('avatar'), registerUser); //added multer middleware to handle image upload
router.post("/login", loginUser);
router.post("/logout", logoutUser);

//secured routes
router.post("/update", verifyJWT, upload.single('avatar'), updateUser)

export default router;
