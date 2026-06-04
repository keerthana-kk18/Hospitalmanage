import express from 'express';
import { adddoctor, getdoctors } from '../controller/admincontroller.js';
import upload from '../config/multer.js';

const router=express.Router()
router.post('/adddoctor',upload.single('image'), adddoctor)
router.get('/doctors',getdoctors)
export default router;