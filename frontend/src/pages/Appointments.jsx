import React, {useState, useEffect} from 'react'
import { FaRibbon } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdCalendarMonth, MdClose, MdOutlineWatchLater, MdHighlightOff} from "react-icons/md";
import { MdMenu } from "react-icons/md";
import { MdCheckCircleOutline } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios'


const Appointments = () => {
    const[open,setopen]=useState(false);
    const location=useLocation();
    const[appointments,setappointments]=useState([]);
    const[loading,setloading]=useState(true);

   const fetchappointments = async () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const email = userInfo?.email

    try {
        setloading(true);
        const response = await axios.post('http://localhost:5000/api/booking/getuserbookings', { 
            email: email 
        });
        setappointments(response.data.bookings || []);
    } catch (error) {
        console.error("Error:", error);
    } finally {
        setloading(false);
    }
}
    useEffect(()=>{
        fetchappointments();
    }, []);

    const handlecancel=async(id)=>{
        if(window.confirm("Are you sure you want to cancel this appointment?")) {
            try{
                const response= await axios.patch(`http://localhost:5000/api/booking/${id}/cancel`)
                if(response.data.success){
                    alert("Appointment cancelled successfully")
                    fetchappointments();
                }
            } catch(error){
                alert(error.response?.data?.message || "Could not cancel appointment. Please try again")
            }
        }
    };
  return (
    <div className='min-h-screen relative bg-blue'>
        <nav className='flex items-center justify-between h-20 bg-white shadow-2xl px-6 lg:px-20 max-w-7xl mx-auto relative z-50 mt-10 rounded-2xl'>
            <div className='flex items-center gap-2'>
                <FaRibbon size={30} color='#26A69A'/>
                <span className='text-2xl font-bold '>Medicare</span>
            </div>
            <div className='hidden md:flex items-center gap-10'>
                <Link to='/userhome'>
                    <button className={` font-medium text-lg ${location.pathname==='/userhome'?'text-[#26A69A]':'text-black'}`}>Doctors</button>
                </Link>
                <Link to='/appointments'>
                    <button className={` font-medium text-lg ${location.pathname==='/appointments'?'text-[#26A69A]':'text-black'}`}>Appointments</button>
                </Link>
                <Link to='/medicalrecords'>
                    <button className={` font-medium text-lg ${location.pathname==='/medicalrecords'?'text-[#26A69A]':'text-black'}`}>Medical Records</button>
                </Link>
                <Link to='/profile'>
                    <button className={` font-medium text-lg ${location.pathname==='/profile'?'text-[#26A69A]':'text-black'}`}>Profile</button>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 ">
                <Link to='/login'>
                <button className='font-semibold text-red-500 text-lg flex items-center gap-2'> 
                    <LuLogOut size={22} color='#EF4444'/>
                    <span>Logout</span></button>
                </Link>
                
                </div>
            <div className='md:hidden'>
                <button onClick={()=>setopen(!open)} className='text-slate-800 focus:outline-none'>
                    {open?<MdClose size={32}/>:<MdMenu size={32}/>}
                </button>
            </div>
        </nav>

        {open && ( 
            <div className='absolute top-16 right-6 w-64 bg-white shadow-2xl rounded-xl z-50 p-5 md:hidden flex flex-col gap-4 mt-4'>
                <Link to='/userhome' onClick={()=>setopen(false)} className='text-lg font-medium text-slate-800  pb-2'>Doctors</Link>
                <Link to='/appointments' onClick={()=>setopen(false)} className='text-lg font-medium text-slate-800  pb-2'>Appointments</Link>
                <Link to='/medicalrecords' onClick={()=>setopen(false)} className='text-lg font-medium text-slate-800  pb-2'>Medical Records</Link>
                <Link to='/profile' onClick={()=>setopen(false)} className='text-lg font-medium text-slate-800  pb-2'>Profile</Link>

                <div className=' gap-3 pt-2'>
                    <Link to='/home' onClick={()=> setopen(false)} className='flex items-center justify-center gap-2 text-center font-semibold text-red-500 py-2 border border-gray-200 rounded-lg'>
                    <LuLogOut size={22} color='#EF4444'/>
                    <span>Logout</span>
                    </Link>
                     
                </div>
                
                </div>
        )}

        <div className='max-w-7xl mx-auto px-6 mt-16 text-center'>
            <h1 className='text-4xl font-bold text-teal-900 mb-14'>Your Appointments</h1>
            {loading?(
                <div className="text-center text-white text-xl font-medium">Loading scheduled appointments.....</div>
            ):appointments.length=== 0?(
                <div className="text-center text-white text-xl font-medium bg-white/10 py-10 rounded-2xl max-w-md mx-auto backdrop-blur-sm">No appointments found. Start booking inside the Doctors page</div>
            ):(
            <div className='flex flex-wrap justify-center lg:justify-start gap-8'>
                {appointments.map((appt)=>{
                    const doctorObj=appt.doctorId || {}
                    
                    const doctorName=doctorObj.name || doctorObj.fullname || 'Unknown Doctor'
                    const doctorDept=doctorObj.speciality ||doctorObj.specialization || doctorObj.department || 'General Specialist'
                    const doctorImg=doctorObj.image || 'doctor1'

                    const currentStatus = appt.status || 'Pending';
                    let statusClasses = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                    if(currentStatus === 'Pending'){
                        statusClasses = 'bg-yellow-50 text-yellow-600 border-yellow-200';
                    }else if (currentStatus === 'Cancelled') {
                        statusClasses = 'bg-red-50 text-red-600 border-red-100';
                    }else if (currentStatus === 'Completed') {
                        statusClasses = 'bg-emerald-50 text-emerald-600 border-emerald-100';
                    }


                return(    
                <div key={appt._id} className='w-full max-w-md bg-white rounded-3xl shadow-xl border border-teal-50/50 p-8 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl'>
                <div className='w-32 h-32 rounded-full p-1 border-4 border-[#26a69a] shadow-inner mb-5 bg-teal-50/30 overflow-hidden flex items-center justify-center'>
                <img src={doctorImg} alt={doctorName} className='w-full h-full object-cover object-top rounded-full'></img>
                </div>
                <h2 className='text-2xl font-bold text-slate-800 mb-1'>{doctorName}</h2>
                <p className='text-[#26a69a] font-semibold text-base mb-6'>{doctorDept}</p>
                <div className='w-full flex flex-col gap-3 mb-6'>
                    <div className='flex items-center justify-center gap-3 bg-teal-50/40 text-teal-800 font-semibold py-4 px-6 rounded-2xl border border-teal-50'>
                         <MdCalendarMonth size={22} className='text-[#26a69a]'/>
                         <span className='text-base'>{appt.dateString}</span>                   
                    </div>
                    <div className='flex items-center justify-center gap-3 bg-teal-50/40 text-teal-800 font-semibold py-4 px-6 rounded-2xl border border-teal-50'>
                    <MdOutlineWatchLater size={22} className='text-[#26a69a]'/>
                    <span className='text-base'>{appt.timeSlot}</span>
                    </div>
                </div>
                <div className='w-full flex justify-center mt-4'>
                    {currentStatus==='Cancelled'?(
                        <div className='flex items-center gap-2 bg-red-50 text-red-600 font-bold text-lg px-5 py-3 rounded-full border border-red-100 shadow-sm'>
                            <MdHighlightOff size={19}/>
                            <span>Cancelled</span>
                        </div>
                    ):(
                    <div className={`flex items-center gap-2 font-bold text-lg px-5 py-3 rounded-full border shadow-sm ${statusClasses}`}>
                        {currentStatus === 'Cancelled' ? (<MdHighlightOff size={19}/>
                    ) : (<MdCheckCircleOutline size={17}/>)}
                        <span>{currentStatus}</span>
                    </div>
                    )}
                </div>

                <div className='w-full border-t border-gray-100 mt-6 pt-4'>
                    {currentStatus !== 'Cancelled' && currentStatus !== 'Completed' ? (
                    <button onClick={() => handlecancel(appt._id)} className='text-lg font-bold text-red-500 hover:text-red-700 transition-colors'>
                        Cancel Appointment
                    </button>
                ) : (
                    <span className='text-gray-400 font-medium text-base'>
                        {currentStatus === 'Completed' ? 'Appointment Completed' : 'Appointment inactive'}
                   </span>
               )}
                </div>
            </div>
                )
            })}
            </div>
            )}
        </div>
        </div>
  )
}

export default Appointments
