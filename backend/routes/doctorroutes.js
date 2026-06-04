import express from 'express'
import { getdoctorbyid, getDoctorProfile, getDoctorStats, updateAvailability, updateDoctor } from '../controller/doctorcontroller.js'
import { verifytoken } from '../middleware/authmiddleware.js'

const router=express.Router()
router.get('/profile',verifytoken, getDoctorProfile)
router.get('/stats/:id', verifytoken, getDoctorStats)
router.put('/updateavailability',verifytoken,updateAvailability)
router.get('/:id',getdoctorbyid)
router.put('/update/:id',verifytoken,updateDoctor)

export default router