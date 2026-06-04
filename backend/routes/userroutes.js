import express from 'express';
import {signup, login, updateprofile} from '../controller/usercontroller.js'
import { verifytoken } from '../middleware/authmiddleware.js';
import { adddoctor } from '../controller/admincontroller.js';

const router=express.Router()
router.post('/signup',signup);
router.post('/login',login);
router.put('/profile',verifytoken,updateprofile)

export default router;