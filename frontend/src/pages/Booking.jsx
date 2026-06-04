import React, {useEffect, useState} from 'react'
import { FaRibbon } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdClose, MdSearch } from "react-icons/md";
import { MdMenu } from "react-icons/md";
import doctor1 from '../images/doct111.png';
import {MdOutlineCalendarMonth, MdOutlineWatchLater, MdPhoneEnabled} from "react-icons/md";
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';


const Booking = () => {
    const[open,setopen]=useState(false);
    const location=useLocation();
    const{doctorId}=useParams()
    const navigate=useNavigate()
    const[doctorinfo,setdoctorinfo]=useState(null)
    const[availabledates,setavailabledates]=useState([])
    const[rawschedules,setrawschedules]=useState([])
    const[timeslots,settimeslots]=useState([])
    const[selecteddate,setselecteddate]=useState('');
    const[selectedtime,setselectedtime]=useState('');
    const [availableSlots, setavailableSlots] = useState([]);
    
    const[patientdetails,setpatientdetails]=useState({
        fullname:'',
        age:'',
        mobile:'',
        gender:'',
        email:''
    })
    const[loading,setloading]=useState(true)

    useEffect(() => {
    const fetchbookingdata = async () => {
        try {
            setloading(true);
            const doctorres = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`);
            setdoctorinfo(doctorres.data);

            const scheduleres = await axios.get(`http://localhost:5000/api/schedule/doctor/${doctorId}`);
            const schedules = scheduleres.data.schedules;
            setrawschedules(schedules);

            if (schedules.length > 0) {
             const formatteddates = schedules.map((sched) => {
                const dateObj = new Date(sched.dateString);
        
                return {
                    id: sched.dateString,
                    day: dateObj.toLocaleDateString('en-US', { weekday: 'short' }),
                    num: dateObj.getDate(),
                    month: dateObj.toLocaleDateString('en-US', { month: 'short' })
                };
            });               
            setavailabledates(formatteddates);
            setselecteddate(schedules[0].dateString);
            }
           } catch (error) {
            console.error("Error loading booking details", error);
           } finally {
            setloading(false);
        }
    };

    if (doctorId) fetchbookingdata();
    }, [doctorId]);

   useEffect(() => {
    const fetchavailableslots = async () => {
        if (!selecteddate || !doctorId) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/booking/availableslots`, {
                params: { doctorId, dateString: selecteddate }
            });

            if (response.data.success) {
                setavailableSlots(response.data.availableSlots);
                setselectedtime('');
            }
        } catch (error) {
            console.error("Error fetching available slots:", error);
        }
    };

    fetchavailableslots();
    }, [selecteddate, doctorId]);

    useEffect(()=>{
        if(selecteddate && rawschedules.length> 0){
            const matchingschedule=rawschedules.find(sched=> sched.dateString=== selecteddate)
            if(matchingschedule){
                settimeslots(matchingschedule.slots || [])
                setselectedtime('')
            }
        }
    },[selecteddate, rawschedules])

    const handleconfirmbooking=async()=>{
        if(!patientdetails.fullname || !patientdetails.age || !patientdetails.mobile || !patientdetails.gender) {
            alert("Please fill the patient fields")
            return;
        }

        const payload={doctorId, dateString:selecteddate, timeSlot:selectedtime, patientDetails:{
            fullname:patientdetails.fullname, age:Number(patientdetails.age), mobile:patientdetails.mobile, gender:patientdetails.gender, email:patientdetails.email
        }}

        try{
            const response=await axios.post('http://localhost:5000/api/booking/create',payload)
            if(response.data.success){
                alert("Appointment booked successfully")
                navigate('/appointments')
            }
        }catch(error){
            alert(error.response?.data?.message || "Booking failed. Try again")
        }
    }

    const bookingready=selecteddate && selectedtime;
    if(loading){
        return(
            <div className='min-h-screen flex items-center justify-center bg-blue-50 text-white text-xl font-bold'>Loading booking application details....</div>
        )
    }
    
    if(!doctorinfo){
        return(
            <div className='min-h-screen flex items-center justify-center bg-blue text-white text-2xl font-bold'>Doctor profiles missing or unavailable.</div>
        );
    }
    const docName=doctorinfo.fullname || doctorinfo.doctorName
    const docSpeciality=doctorinfo.specialization
    const docQualification=doctorinfo.qualification
    const docFee=doctorinfo.consultationfee ? `₹${doctorinfo.consultationfee}` : 'N/A'
    const docImage=doctorinfo.image

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
           <div className='w-full flex items-center justify-center min-h[calc(100vh-120px)] mt-10 p-4 relative z-10'>
           <div className='w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[450px]'>
            <div className='w-full md:w-1/3 h-72 md:h-auto flex items-center justify-center p-4  relative'>
            <img src={docImage} alt={docName} className='w-64 h-64 object-cover md:absolute md:inset-0 md:mt-24 mx-auto'></img>
            </div>
            <div className='w-full md:2/3 p-8 md:p-12 flex flex-col justify-between bg-white'>
            <div >
                <span className='text-white font-bold text-sm bg-[#26a69a] px-3 py-1 rounded-full'>Verified Specialist</span>
                <h2 className='text-3xl md:text-4xl font-bold text-slate-800 mt-3 mb-1'>{docName}</h2>
                <p className='text-[#26a69a] font-semibold text-xl mb-8'>{doctorinfo.department || docSpeciality}</p>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col gap-2 '>
                        <span className='text-lg font-bold text-gray-400 pl-1'>Qualification</span>
                        <button className='w-full text-left bg-white border border-gray-200 text-slate-700 font-medium px-5 py-4 rounded-xl shadow-lg '>{docQualification}</button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='text-lg font-bold text-gray-400 pl-1'>Consultation Fee</span>
                        <button className='w-full text-left bg-white border border-gray-200 text-slate-700 font-medium px-5 py-4 rounded-xl shadow-lg '>{docFee}</button>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <span className='text-lg font-bold text-gray-400 pl-1'>Availability</span>
                        <button className='w-full text-left bg-white border border-gray-200 text-slate-700 font-medium px-5 py-4 rounded-xl shadow-lg '>{doctorinfo.availability || 'Available'}</button>

                    </div>
                </div>
                </div>
                </div>
           </div>
           </div>
           <div className='min-h-screen p-4 md:p-8 flex items-center justify-center'>
            <div className='w-full max-w-6xl bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-8'>
                <div className='flex items-center gap-2 text-[#26a69a] font-bold text-xl md:text-2xl mb-8 border-b border-gray-100 pb-4'>
                    <MdOutlineCalendarMonth size={28}/>
                    <h2>Book Your Appointment</h2>
                </div>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    <div className='flex flex-col gap-6'>
                        <div>
                            <div className='flex items-center gap-2 text-slate-700 font-bold mb-4'>
                                <MdOutlineCalendarMonth size={20} className='text-[#26a69a]'/>
                                <h3>Select Date</h3>
                            </div>
                            <div className=' flex flex-wrap gap-4'>
                                {availabledates.length> 0?(
                                availabledates.map((d)=>{
                                    const isselected=selecteddate==d.id
                                    return(
                                        <button key={d.id} onClick={()=>setselecteddate(d.id)}
                                        className={`flex flex-col items-center justify-center w-20 h-20 rounded-full border transition-all duration-200 ${
                                            isselected ? 'bg-[#26a69a] text-white border-[#26a69a] shadow-lg scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-[#26a69a]'}`}>
                                                <span className={`text-lg font-medium ${isselected? 'text-teal-100': 'text-gray-400'}`}>{d.day}</span>
                                                <span className='text-xl font-bold leading-tight'>{d.num}</span>
                                                <span className={`text-lg font-medium ${isselected? 'text-teal-100': 'text-gray-400'}`}>{d.month}</span>
                                            </button>
                                    )
                                })
                            ):(
                                <p className='text-gary-400'>No available schedules found</p>
                            )}
                            </div>
                        </div>
                        <div className='border border-gray-200 rounded-2xl p-5 mt-2'>
                            <h3 className='text-[#26a69a] font-bold text-lg mb-4'>Patient Details</h3>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <input type='text' placeholder='Full Name' className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#26a69a] transition-colors' value={patientdetails.fullname} onChange={(e)=>setpatientdetails({...patientdetails,fullname:e.target.value})}></input>
                                <input type='number' placeholder='Age' className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#26a69a] transition-colors' value={patientdetails.age} onChange={(e)=>setpatientdetails({...patientdetails,age:e.target.value})}></input>
                                <input type='tel' placeholder='Mobile number' className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#26a69a] transition-colors' value={patientdetails.mobile} onChange={(e)=>setpatientdetails({...patientdetails,mobile:e.target.value})}></input>
                                <select className='w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#26a69a] transition-colors' value={patientdetails.gender} onChange={(e)=>setpatientdetails({...patientdetails,gender:e.target.value})}>
                                    <option value=''>Gender</option>
                                    <option value='Male'>Male</option>
                                    <option value='Female'>Female</option>
                                    <option value='Other'>Other</option>
                                </select>
                                <input type='email' placeholder='Email (optional- for receipts)' className='w-full md:col-span-2 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#26a69a] transition-colors' value={patientdetails.email} onChange={(e)=>setpatientdetails({...patientdetails,email:e.target.value})}></input>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div>
                            <div className='flex items-center gap-2 text-slate-700 font-bold mb-4'>
                                <MdOutlineWatchLater size={20} className='text-[#26a69a]'/>
                                <h3>Available Slots</h3>
                            </div>
                            <div className='flex gap-4'>
                                {availableSlots.length> 0 ?(
                                availableSlots.map((time)=>{
                                    const isselected=selectedtime===time
                                    return(
                                        <button key={time} onClick={()=>setselectedtime(time)} className={`flex items-center justify-center gap-2 px-6 py-3 border rounded-full font-medium transition-all duration-200 ${
                                            isselected ? 'bg-[#26a69a] text-white border-[#26a69a] shadow-lg': 'bg-white text-slate-700 border-gray-200 hover:border-[#26a69a]'}`}>
                                            <MdOutlineWatchLater size={18} className={isselected?'text-teal-100' : 'text-slate-400'}/>
                                            <span>{time}</span>
                                        </button>
                                    )
                                })
                            ):(
                                <p className='text-gray-400'>Select a date to view available time slots</p>
                            )}
                            </div>
                        </div>

                        <div className='bg-emerald-50/80 border border-emerald-300 rounded-2xl p-6 flex flex-col justify-between flex-grow mt-2'>
                        <div className='flex flex-col gap-4 text-base text-slate-700'>
                            <div className='flex justify-between items-center py-1'>
                                <span className='text-gray-500 font-medium'>Selected Doctor:</span>
                                <span className='font-bold text-[#26a69a]'>{docName}</span>
                            </div>
                            <div className='flex justify-between items-center py-1'>
                                <span className='text-gray-500 font-medium'>Doctor Speciality:</span>
                                <span className='font-semibold text-slate-800'>{docSpeciality}</span>
                            </div>
                            <div className='flex justify-between items-center py-1'>
                                <span className='text-gray-500 font-medium'>Selected Date:</span>
                                <span className='font-semibold text-slate-800'>{selecteddate?selecteddate : 'Not selected'}</span>
                            </div>
                            <div className='flex justify-between items-center py-1'>
                                <span className='text-gray-500 font-medium'>Selected Time:</span>
                                <span className={`font-semibold ${selectedtime?'text-slate-800':'text-red-400 font-medium'}`}>{selectedtime || 'Not selected'}</span>
                            </div>
                            <div className='flex justify-between items-center border-t border-dashed border-gray-200 pt-4 mt-2'>
                                <span className='text-gray-500 font-medium'>Consultation Fee:</span>
                                <span className='text-xl font-extrabold text-red-500'>{docFee}</span>
                            </div>
                        </div>
                        <div className='mt-8'>
                            <button disabled={!bookingready} onClick={handleconfirmbooking} className={`w-full font-bold py-4 rounded-xl shadow-lg transition-all duration-300 flex items-center justify-center gap-2 text-lg ${
                                bookingready? 'bg-[#26a69a] text-white hover:bg-[#1f847b]' : 'bg-slate-200 text-gray-400 cursor-not-allowed shadow-none'}`}>
                                    <MdPhoneEnabled size={20}/>
                                    <span>Confirm Booking</span>
                                </button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
           </div>
           </div>
  )
}

export default Booking