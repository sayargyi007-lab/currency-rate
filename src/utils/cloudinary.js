import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv"
import fs from "fs"

dotenv.config()

  // Configuration
  cloudinary.config({ 
    cloud_name: 'dtrqav44c', 
    api_key: '564479735666873', 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

export const uploadToCloudinary =async(filePath)=>{
    try {
        const uploadUrl = await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })
        console.log("file upload complete",uploadUrl.url)
        fs.unlinkSync(filePath)
        console.log(filePath)
        return uploadUrl.url
        
    } catch (error) {
        console.log("Error at uploading to cloudinary")
        fs.unlinkSync(filePath)
        return null
    }
}

