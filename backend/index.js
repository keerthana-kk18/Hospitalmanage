import express from 'express'
import cors from 'cors'
import {connectDB} from './config/db.js'
import userroutes from './routes/userroutes.js'
import adminroutes from './routes/adminroutes.js'
import scheduleroutes from './routes/scheduleroutes.js'
import bookingroutes from './routes/bookingroutes.js'
import doctorroutes from './routes/doctorroutes.js'

const app=express();
connectDB();
const allowedOrigins = [
    "http://localhost:5173", 
    "https://hospitalmanage-vvv4-phi.vercel.app"
];
app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));
app.use(express.json())
app.use('/api/user',userroutes)
app.use('/api/admin',adminroutes)
app.use('/api/schedule',scheduleroutes)
app.use('/api/booking',bookingroutes)
app.use('/api/doctor',doctorroutes)
const PORT=process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})