import { Router } from "express";
import { createShortUrl, getAllUrls, getUserUrls, redirectUrl } from "../controllers/url.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

//redirect url
router.get('/redirect', redirectUrl);
// router.get('/', getAllUrls);

router.post("/shorten", createShortUrl);


//secured routes
router.get('/my-urls', verifyJWT, getUserUrls);

export default router;