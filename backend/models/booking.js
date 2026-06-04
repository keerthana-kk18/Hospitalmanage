import mongoose from "mongoose";

const bookingSchema=new mongoose.Schema(
    {
        doctorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'Doctor',
            required:true
        },
        dateString:{
            type:String,
            required:true
        },
        timeSlot:{
            type:String,
            required:true
        },
        patientDetails:{
            fullname:{
                type:String,
                required:true,
                trim:true
            },
            age:{
                type:Number,
                required:true
            },
            mobile:{
                type:String,
                required:true,
                trim:true
            },
            gender:{
                type:String,
                required:true,
                enum:['Male','Female','Other']
            },
            email:{
                type:String,
                trim:true,
                lowercase:true,
                default:''
            }

        },
        status:{
            type:String,
            enum:['Pending','Completed','Cancelled'],
            default:'Pending'
        },
        medicalrecord: { 
            type: String, 
            default: '' 
        }

    },
    {
        timestamps:true
    }
)
const Booking=mongoose.model('Booking',bookingSchema, 'bookings')
export default Booking