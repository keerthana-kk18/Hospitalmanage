import mongoose from 'mongoose';
import Schedule from '../models/schedule.js';
import Booking from '../models/booking.js';
import User from '../models/users.js'
import Doctor from '../models/doctor.js'

export const createbooking = async (req, res) => {
    try {
        const { doctorId, dateString, timeSlot, patientDetails } = req.body;
        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found." });
        }

        if (doctor.isAvailable === false) {
            return res.status(403).json({ 
                success: false, 
                message: "This doctor is currently not accepting new appointments." 
            });
        }

        if (!doctorId || !dateString || !timeSlot || !patientDetails?.fullname || !patientDetails?.mobile) {
            return res.status(400).json({ message: "Please fill in all required fields." });
        }

        const slotTaken = await Booking.findOne({ doctorId, dateString, timeSlot, status: { $ne: 'Cancelled' } });
        if (slotTaken) {
            return res.status(400).json({ success: false, message: "This slot is already booked." });
        }

        const existingPatientBooking = await Booking.findOne({
            doctorId,
            dateString,
            'patientDetails.mobile': patientDetails.mobile,
            status: { $ne: 'Cancelled' }
        });

        if (existingPatientBooking) {
            return res.status(400).json({ 
                success: false, 
                message: "You already have an appointment with this doctor on this day." 
            });
        }

        const newbooking = new Booking({
            doctorId,
            dateString,
            timeSlot,
            patientDetails
        });
        
        await newbooking.save();
        res.status(201).json({ success: true, message: 'Appointment booked successfully', booking: newbooking });

    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Booking failed due to a server error', 
            error: error.message 
        });
    }
}
export const getuserbookings = async (req, res) => {
    try {
        const { email } = req.body;

        const bookings = await Booking.find({ 'patientDetails.email': email })
            .populate('doctorId', 'fullname specialization image')
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch' });
    }
}

export const cancelbooking=async(req,res)=>{
    try{
        const updatedbooking=await Booking.findByIdAndUpdate(req.params.id, {status:'Cancelled'}, {new:true})
        if(!updatedbooking){
            return res.status(404).json({success:false, message:'Appointment not found'})
        }
        res.status(200).json({success:true, message:'Appointment cancelled successfully', booking:updatedbooking})
    }catch(error){
        res.status(500).json({success:false, message:'Cancellation failed', error:error.message})
    }
}

export const getdoctorbookings = async (req, res) => {
    try {
        const { doctorId } = req.params;
        
        const sample = await Booking.findOne({}).lean();
        
        const bookings = await Booking.find({ doctorId: doctorId });

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getavailableslots = async (req, res) => {
    try {
        const { doctorId, dateString } = req.query;

        const schedule = await Schedule.findOne({ doctorId, dateString });

        if (!schedule) {
            return res.status(404).json({ success: false, message: "No schedule found for this date" });
        }

        const allSlots = schedule.slots || []; 

        const bookedAppointments = await Booking.find({
            doctorId,
            dateString,
            status: { $ne: 'Cancelled' } 
        });

        const takenTimeSlots = bookedAppointments.map(b => b.timeSlot);
        const availableSlots = allSlots.filter(slot => !takenTimeSlots.includes(slot));

        res.status(200).json({ success: true, availableSlots });
    } catch (error) {
        console.error("Backend Error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const uploadMedicalRecord = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }
        
        const fileUrl = req.file.path; 
        
        await Booking.findByIdAndUpdate(id, { medicalrecord: fileUrl });
        
        res.status(200).json({ success: true, path: fileUrl });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        await Booking.findByIdAndUpdate(id, { status });
        
        res.status(200).json({ success: true, message: "Status updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getPatientMedicalRecords = async (req, res) => {
    console.log("Inside getPatientMedicalRecords controller");
    try {
        const { email } = req.query;
        console.log("Searching for email:", email);
        const normalizedEmail = email.toLowerCase().trim();
        
        const records = await Booking.find({ 
            'patientDetails.email': { $regex: new RegExp(`^${normalizedEmail}$`, 'i') },
            medicalrecord: { $exists: true, $ne: null, $ne: "" } 
        }).populate('doctorId', 'fullname');
        console.log("Records found:", records.length);
        res.status(200).json({ success: true, records });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find().populate('doctorId', 'fullname');
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch bookings" });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const total = await Booking.countDocuments();
        const completed = await Booking.countDocuments({ status: 'Completed' });
        const cancelled = await Booking.countDocuments({ status: 'Cancelled' });
        
        res.status(200).json({ total, completed, cancelled });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
};