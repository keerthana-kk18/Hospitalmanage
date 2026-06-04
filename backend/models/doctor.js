import mongoose from "mongoose";

const doctorSchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
        trim:true
    },
    specialization:{
        type:String,
        required:true,
        trim:true
    },
    experience:{
        type:Number,
        required:true,
    },
    qualification:{
        type:String,
        required:true,
        trim:true
    },
    consultationfee:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        default:'doctor'
    },
    status:{
        type:String,
        enum:['Available','Not Available'],
        default:'Available'
    },
    appointments:{
        type:Number,
        default:0
    },
    image:{
        type:String,
        required:true
    },
    cloudinary_id:{
        type:String,
        required:true
    }
    },{timestamps:true})

export default mongoose.model('Doctor',doctorSchema)