import { Router } from "express";
import { createShortUrl, getAllUrls, redirectUrl } from "../controllers/url.controller.js";

const router = Router();

router.post("/shorten", createShortUrl);
router.get('/all', getAllUrls);
router.get('/redirect', redirectUrl);

export default router;