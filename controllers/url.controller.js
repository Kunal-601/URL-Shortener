import { nanoid } from "nanoid";
import URL from "../models/url.model.js";
import isValidUrl from "../utils/isValidUrl.js";


// Create a short URL
export const createShortUrl = async(req, res) => {
    try{
        const {originalUrl, owner} = req.body;
        // check if the url is valid
        if(!isValidUrl(originalUrl))
        {
            return res.status(400).json({error: "Invalid URL"});
        }
        //check for valid owner
        if(!owner)
        {
            return res.status(400).json({error: "Owner ID is required"});
        }
        const shortid = nanoid(8);
        const shortURL = `${process.env.BASE_URL}/${shortid}`;

        const newUrl  = new URL({
            originalUrl,
            shortURL: shortid,
            owner
        })
        await newUrl .save();
        res.status(201)
        .json({
            success: true,
            message: "Short URL created successfully",
            data: {
                originalUrl: newUrl.originalUrl,
                shortURL,
                clicks: newUrl.clicks,
                createdAt: newUrl.createdAt,
            },
        })

    }
    catch(error){
        res.status(500).json({ error: 'Server error' });
    }
}

// Get all URLs
export const redirectUrl = async(req, res) => {
   try{
        const {shortId} = req.query;
        if (!shortId) {
            return res.status(400).json({ error: "Short ID is required" });
        }
        const url = await URL.findOne({shortURL: shortId});
        if(!url)
        {
            return res.status(404).json({error: "URL not found"});
        }
        await url.incrementClicks();
        res.status(200).json({
            success: true,
            message: "URL redirected successfully",
            data: {
                originalUrl: url.originalUrl,
            },
        });
        // res.redirect(url.originalUrl);
    }
    catch(error){
        res.status(500).json({ error: 'Server error' });
    }
};

// Get all URLs
export const getAllUrls = async(req, res) => {
    try{
        const urls = await URL.find();
        res.status(200).json({
            success: true,
            data: urls
        })
    }
    catch(error){
        res.status(500).json({ error: 'Server error' });
    }
};