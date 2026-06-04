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
app.use(cors({origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true}));
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