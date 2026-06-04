import React,{useState, useEffect} from 'react'
import doctor1 from '../images/doct111.png';
import axios from 'axios';

const apiurl=import.meta.env.VITE_BACKEND_URL;


const InfoField = ({ label, value }) => (
    <div className='flex flex-col gap-2'>
        <span className='text-[#26a69a] font-bold text-lg'>{label}</span>
        <div className='w-full border-2 border-[#26a69a]/20 rounded-2xl px-5 py-4 text-slate-700 font-bold text-lg bg-slate-50/50 select-none'>
            {value !== undefined && value !== null ? value : "N/A"}
        </div>
    </div>
);

const Doctorview = ({doctor}) => {
   const [stats, setStats] = useState({
        totalAppointments: 0,
        completedAppointments: 0,
        pendingAppointments: 0,
        cancelledAppointments: 0
    });

    useEffect(() => {
    const fetchStats = async () => {
    try {
        const targetDoctorId = doctor._id; 
        
        const response = await axios.get(`${apiurl}/api/doctor/stats/${targetDoctorId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setStats(response.data);
    } catch (err) {
        console.error(err);
    }
};
    if (doctor) fetchStats();
}, [doctor]);
    if (!doctor) {
        return <div className='text-slate-500 font-bold text-center py-10'>No doctor data available</div>;
    }

    const {
        fullname, name, speciality, specialization, department, experience, 
        qualification, consultationfee, email, image
    } = doctor;

  return (
    <div className='w-full max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100'>
        <div className='h-24 bg-[#26a69a]'></div>
        <div className='px-6 pb-6 md:px-8 -mt-12'>
            <div className='relative inline-block mb-6'>
                <div className='w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-100'>
                    <img src={image || doctor1} alt={fullname || name}  className='w-full h-full object-cover'></img>
                </div>
            </div>
            <div className='mb-10'>
                <h1 className='text-4xl font-extrabold text-[#004d40] tracking-wide'>{fullname || name || "Unknown Doctor"}</h1>
            </div>
            <div className='mb-12'>
                <h2 className='text-2xl font-extrabold text-[#004d40] tracking-wide mb-6 flex items-center gap-2'>Personal Information</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <InfoField label="Name" value={fullname || name} />
                        <InfoField label="Specialization" value={speciality || specialization || department} />
                        <InfoField label="Experience" value={`${experience || 0} years`} />
                        <InfoField label="Qualification" value={qualification} />
                        <InfoField label="Consultation Fee" value={`₹${consultationfee}`} />
                        <InfoField label="Email" value={email} />

                        <InfoField label="Total Appointments" value={stats.totalAppointments} />
                        <InfoField label="Completed" value={stats.completedAppointments} />
                        <InfoField label="Pending" value={stats.pendingAppointments} />
                        <InfoField label="Cancelled" value={stats.cancelledAppointments} />

                        <InfoField label="Password" value="••••••••" />
                </div>
            </div>
        </div>
    </div>
  )
}

export default Doctorview