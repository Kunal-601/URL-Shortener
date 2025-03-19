import { Router } from "express";
import URL from "../models/url.model.js";

const router = Router();

router.get('/', async (req, res)=>{
    try{
        const allUrls = await URL.find({});
        res.render('home', {
            urls: allUrls,
            // name: 'Kunal Kaushik'
        });
    }catch(error){
        res
        .status(500)
        .render('home', {
            urls: [],
            error: 'Error in fetching all URLs'
        })
    }
})

export default router;
