import mongoose from "mongoose";
import Schedule from "../models/schedule.js";

export const getschedules=async(req,res)=>{
    try{
        const{doctorid}=req.params
        const schedules=await Schedule.find({ doctorId: new mongoose.Types.ObjectId(doctorid) }).sort({dateString:1})
        res.status(200).json({schedules})
    } catch(error){
        res.status(500).json({message:'Failed to fetch schedules', error:error.message})
    }
}

export const adddate=async(req,res)=>{
    try{
        const{doctorid,dateString,displaydate,displayDate}=req.body
        const finaldisplaydate=displaydate || displayDate
        if(!doctorid||!dateString||!finaldisplaydate){
            return res.status(400).json({message:'missing required schedule datas'})
        }
        const casteddoctorid=new mongoose.Types.ObjectId(doctorid)
        const existingschedule=await Schedule.findOne({ doctorId: casteddoctorid, dateString })
        if(existingschedule){
            return res.status(400).json({message:'Schedule for this date already exists'}) 
        }
        const newschedule=new Schedule({ doctorId:casteddoctorid, dateString, displayDate:finaldisplaydate, slots:[] })
        await newschedule.save()
        res.status(201).json(newschedule)
    }catch(error){
        console.error("Mongoose save error details:",error.message);
        
        res.status(500).json({message:'Failed to add schedule', error:error.message})
    }
}

export const addslot=async(req,res)=>{
    try{
        const{doctorid,dateString,timeslot}=req.body
        const casteddoctorid=new mongoose.Types.ObjectId(doctorid)
        const schedule=await Schedule.findOne({ doctorId:casteddoctorid, dateString })
        if(!schedule){
            return res.status(404).json({message:'Schedule not found'})
        }
        if(schedule.slots.includes(timeslot)){
            return res.status(400).json({message:'Time slot already exists for this date'})
        }
        schedule.slots.push(timeslot)
        await schedule.save()
        res.status(200).json({schedule})
    }catch(error){
        res.status(500).json({message:'Failed to add time slot', error:error.message})
    }
}

export const deleteslot=async(req,res)=>{
    try{
        const{doctorid,dateString,timeslot}=req.body
        const casteddoctorid=new mongoose.Types.ObjectId(doctorid)
        const schedule=await Schedule.findOne({ doctorId:casteddoctorid, dateString })
        if(!schedule){
            return res.status(404).json({message:'Schedule not found'})
        }
        schedule.slots=schedule.slots.filter(slot=>slot!==timeslot)
        await schedule.save()
        res.status(200).json({schedule})
    }catch(error){
        res.status(500).json({message:'Failed to delete time slot', error:error.message})
    }
}

export const deletedate=async(req,res)=>{
    try{
        const{doctorid,dateString}=req.body
        const casteddoctorid=new mongoose.Types.ObjectId(doctorid)
        const deletedschedule=await Schedule.findOneAndDelete({ doctorId:casteddoctorid, dateString })
        if(!deletedschedule){
            return res.status(404).json({message:'Schedule not found'})
        }
        res.status(200).json({message:'Schedule deleted successfully'})
    }catch(error){
        res.status(500).json({message:'Failed to delete schedule', error:error.message})
    }
}

export const getschedulebydoctorid=async(req,res)=>{
    try{
        const{doctorid}=req.params
        const schedules=await Schedule.find({doctorId:new mongoose.Types.ObjectId(doctorid)}).sort({dateString:1})
        res.status(200).json({schedules})
    }catch(error){
        res.status(500).json({message:"Server error",error:error.message})
    }
}