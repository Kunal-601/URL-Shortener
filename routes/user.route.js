import { Router } from "express";
// import User from '../models/user.model.js';
import { createUser, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

//get route to get all users
router.get('/', getAllUsers)

//post route to create a new user
router.post('/', createUser)


export default router;