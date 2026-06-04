import Doctor from "../models/doctor.js";
import bcrypt from 'bcrypt';

export const adddoctor=async(req,res)=>{
    if(!req.file){
        console.log("No file uploaded");
        return res.status(400).json({message:'Image is required'})
    }
    try{
        const{fullname,specialization,experience,qualification,consultationfee,email,password}=req.body
        if(!fullname||!specialization||!experience||!qualification||!consultationfee||!email||!password){
            return res.status(400).json({message:'All fields are required'})
        }
        const cleanemail=email.toLowerCase().trim();
        const doctorexist=await Doctor.findOne({email:cleanemail})
        if(doctorexist){
            return res.status(400).json({message:'Doctor already exists'})
        }
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(password,salt)
        const newdoctor=new Doctor({
            fullname:fullname.trim(),
            specialization:specialization.trim(),
            experience:Number(experience),
            qualification:qualification.trim(),
            consultationfee:Number(consultationfee),
            email:cleanemail,
            password:hashedpassword,
            image:req.file.path,
            cloudinary_id:req.file.filename,
            role:'doctor'
      });
    await newdoctor.save()
    res.status(201).json({message:'Doctor added successfully', doctor:newdoctor})
    }catch(error){
        console.log("Add doctor failed:",error)
        res.status(500).json({message:error.message})
    }
}

export const getdoctors=async(req,res)=>{
    try{
        const doctors=await Doctor.find({}).select('-password').sort({createdAt:-1})
        res.status(200).json({doctors})
    }catch(error){
        console.log("Fetch doctors failed:",error.message)
        res.status(500).json({message:'Failed to fetch doctors', error:error.message})
    }
}