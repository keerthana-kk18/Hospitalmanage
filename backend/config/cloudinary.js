import express from 'express'
import {v2 as cloudinary} from "cloudinary"
import 'dotenv/config'

const router=express.Router();
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.CLOUD_SECRET,
});
router.get('/get-signed-url/:publicId', (req, res) => {
    try {
        const publicId = req.params.publicId; 
        
        console.log("DEBUG: Signing Public ID:", publicId);

        const url = cloudinary.url(publicId, {
            sign_url: true,
            secure: true,
            transformation: [{ flags: "attachment" }]
        });

        res.json({ signedUrl: url });
    } catch (error) {
        console.error("Cloudinary Signing Error:", error);
        res.status(500).json({ error: "Failed to sign URL" });
    }
});

export default cloudinary;
