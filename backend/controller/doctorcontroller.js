import Doctor from '../models/doctor.js'
import Booking from '../models/booking.js'

export const getdoctorbyid=async(req,res)=>{
    try{
        const doctor=await Doctor.findById(req.params.id)
        if(!doctor){
            return res.status(404).json({message:'Doctor not found'})
        }
        res.json(doctor)
    }catch(error){
        res.status(500).json({message:'Server error', error:error.message})
    }

}

export const getDoctorProfile = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.user.id).select('-password');
        
        const appointmentCount = await Booking.countDocuments({ doctorId: req.user.id });

        const doctorData = doctor.toObject();
        doctorData.appointments = appointmentCount;

        res.status(200).json(doctorData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAvailability = async (req, res) => {
    try {
        const newStatus = req.body.isAvailable ? 'Available' : 'Not Available';
        
        const doctor = await Doctor.findByIdAndUpdate(
            req.user.id, 
            { status: newStatus }, 
            { new: true }
        );
        res.status(200).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorStats = async (req, res) => {
    try {
        const doctorId = req.params.id; 
        
        console.log("Admin requesting stats for Doctor ID:", doctorId);

        const [total, completed, pending, cancelled] = await Promise.all([
            Booking.countDocuments({ doctorId: doctorId }),
            Booking.countDocuments({ doctorId: doctorId, status: 'Completed' }),
            Booking.countDocuments({ doctorId: doctorId, status: 'Pending' }),
            Booking.countDocuments({ doctorId: doctorId, status: 'Cancelled' })
        ]);

        res.status(200).json({
            totalAppointments: total,
            completedAppointments: completed,
            pendingAppointments: pending,
            cancelledAppointments: cancelled
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const { password, ...updateData } = req.body;

        if (password && password.trim() !== "") {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            id, 
            { $set: updateData }, 
            { new: true }
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json(updatedDoctor);
    } catch (error) {
        console.error("Update error:", error);
        res.status(500).json({ message: "Update failed" });
    }
};