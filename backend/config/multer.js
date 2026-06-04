import multer from 'multer'
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import cloudinary from './cloudinary.js'

const storage=new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'project_upload',
        resource_type:"auto",
        allowed_formats:["jpg","png","jpeg","webp","pdf"],
    },
});
const upload=multer({storage});
export default upload;