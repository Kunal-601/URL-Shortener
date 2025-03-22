import express from "express";
import { getMessages, getUsers, sendMessage } from "../controllers/message.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();
import {upload} from "../middlewares/multer.middleware.js";

router.get('/users', verifyJWT, getUsers); //get the list of users except the current user
router.get('/:id', verifyJWT, getMessages); //get messages between two users
router.post('/send/:id', verifyJWT, upload.single("image"), sendMessage); //send message to a user

export default router;
