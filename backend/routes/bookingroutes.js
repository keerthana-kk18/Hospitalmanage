import express from 'express'
import { cancelbooking, createbooking, getAllBookings, getavailableslots, getDashboardStats, getdoctorbookings, getPatientMedicalRecords, getuserbookings, updateBookingStatus, uploadMedicalRecord } from '../controller/bookingcontroller.js'
import upload from '../config/multer.js'
import { verifytoken } from '../middleware/authmiddleware.js'
console.log("Booking routes file loaded successfully");
const router=express.Router()
router.get('/medicalrecords',verifytoken,getPatientMedicalRecords)
router.get('/availableslots',getavailableslots)
router.post('/create',createbooking)
router.post('/getuserbookings',getuserbookings)
router.get('/doctor/:doctorId',getdoctorbookings)


router.patch('/:id/cancel', cancelbooking)
router.patch('/:id/status', updateBookingStatus);
router.post('/:id/upload', upload.single('medicalrecord'), uploadMedicalRecord);
router.get('/dashstats', getDashboardStats)

router.get('/all', verifytoken, getAllBookings);




export default router