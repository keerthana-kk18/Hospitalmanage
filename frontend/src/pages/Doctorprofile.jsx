import React, {useState, useEffect} from 'react'
import axios from 'axios'

const apiurl=import.meta.env.VITE_BACKEND_URL;


const Doctorprofile = () => {
    const [doctorData, setDoctorData] = useState(null);
    const[loading,setloading]=useState(true)

    useEffect(() => {
        const fetchDoctorData = async () => {
            try {
                const token = localStorage.getItem('token'); 
                const response = await axios.get(`${apiurl}/api/doctor/profile`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                
                setDoctorData(response.data);
            } catch (error) {
                console.error("Error fetching doctor profile:", error);
            } finally {
                setloading(false);
            }
        };

        fetchDoctorData();
    }, []);

    if (!doctorData) return <div className='p-10'>Loading profile...</div>;


  return (
    <div className='w-full max-w-5xl max-h mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100'>
        <div className='h-36 bg-[#26a69a]'></div>
        <div className='px-6 md:p-10 -mt-16'>
            <div className='relative inline-block mb-6'>
                <div className='w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-100'>
                    <img src={doctorData?.image || doctor1} alt="Doctor" className='w-full h-full object-cover' />               
                </div>
            </div>
            <div className='mb-10'>
                <h1 className='text-4xl font-extrabold text-[#004d40] tracking-wide'>{doctorData?.fullname || doctorData?.name || "Doctor Name"}</h1>
            </div>
            <div className='mb-12'>
                <h2 className='text-2xl font-extrabold text-[#004d40] tracking-wide mb-6 flex items-center gap-2'>Personal Information</h2>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <ProfileField label="Name" value={doctorData?.fullname || doctorData?.name} />
                        <ProfileField label="Specialization" value={doctorData?.specialization || "Not Specified"} />
                        <ProfileField label="Experience" value={doctorData?.experience ? `${doctorData.experience} years` : "0 years"} />
                        <ProfileField label="Qualification" value={doctorData?.qualification || "N/A"} />
                        <ProfileField label="Email" value={doctorData.email} />
                        <ProfileField label="Patients" value={doctorData?.appointments ?? 0} />
                </div>
            </div>
        </div>
    </div>
  )
}

const ProfileField = ({ label, value }) => (
    <div className='flex flex-col gap-2'>
        <span className='text-[#26a69a] font-bold text-lg'>{label}</span>
        <div className='w-full border-2 border-[#26a69a]/20 rounded-2xl px-5 py-4 text-slate-700 font-bold text-lg bg-slate-50/50 select-none'>
            {value}
        </div>
    </div>
);

export default Doctorprofile