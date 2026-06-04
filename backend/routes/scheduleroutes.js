import express from 'express'
import { getschedules, adddate, addslot, deleteslot, deletedate, getschedulebydoctorid } from '../controller/schedulecontroller.js'

const router=express.Router()
router.get('/all',getschedules)
router.post('/adddate',adddate)
router.delete('/deletedate',deletedate)
router.post('/addslot',addslot)
router.delete('/deleteslot',deleteslot)
router.get('/doctor/:doctorid',getschedulebydoctorid)

export default router