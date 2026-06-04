import mongoose from 'mongoose';

const scheduleSchema=new mongoose.Schema({
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Doctor',
        required:true
    },
    dateString:{
        type:String,
        required:true
    },
    displayDate:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        default:true
    },
    slots:[
        {
            type:String
        }
    ]

},{timestamps:true})
scheduleSchema.index({doctorId:1, dateString:1}, {unique:true})
const Schedule=mongoose.model('Schedule',scheduleSchema)
export default Schedule