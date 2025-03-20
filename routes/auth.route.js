import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/auth.controller.js";

const router = Router();

// Auth routes OR the API routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Page rendering routes
router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

export default router;

