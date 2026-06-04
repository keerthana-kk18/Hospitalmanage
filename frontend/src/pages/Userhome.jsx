import React, {useState, useEffect} from 'react'
import { FaRibbon } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdClose, MdSearch } from "react-icons/md";
import { MdMenu } from "react-icons/md";
import { IoSearchOutline } from "react-icons/io5";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';



const Userhome = () => {
     const[open,setopen]=useState(false);
     const location=useLocation();
     const[searchdoctor,setsearchdoctor]=useState('');
     const[doctors,setdoctors]=useState([])
     const[loading,setloading]=useState(true)

     useEffect(()=>{
        const fetchdoctors=async()=>{
            try{
                const response=await axios.get('http://localhost:5000/api/admin/doctors')
                const rawdata=Array.isArray(response.data)? response.data : (response.data.doctors || response.data.data || [])
                setdoctors(rawdata) 
            }catch(error){
                console.error("Error fetching doctors:",error)
            }finally{
                setloading(false)
            }
        }
        fetchdoctors();
     },[])

        const filtereddoctors=doctors.filter((doc)=>{
        const doctor=searchdoctor.toLowerCase();
        return(
            doc.fullname?.toLowerCase().includes(doctor)|| doc.specialization?.toLowerCase().includes(doctor)
        ) 
     })
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
                <Link to='/'>
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
                    <Link to='/' onClick={()=> setopen(false)} className='flex items-center justify-center gap-2 text-center font-semibold text-red-500 py-2 border border-gray-200 rounded-lg'>
                    <LuLogOut size={22} color='#EF4444'/> 
                    <span>Logout</span>
                    </Link>
                     
                </div>
                
                </div>
        )}
        <div className='text-center mt-16 px-4'>
            <h1 className='text-5xl md:text-6xl font-bold text-black mb-3 '>Our <i><span className='text-[#26a69a]'>Medical Team</span></i> </h1>
            <p className='text-lg text-gray-600 max-w-xl mx-auto font-medium'>Book appointments quickly with our verified specialists</p>
        </div>
        <div className='max-w-md mx-auto px-6 mt-10 relative'>
            <div className='relative flex items-center bg-white rounded-full shadow-lg border border-gray-100 overflow-hidden px-4 focus-within:ring-[#26a69a] transition-all'>
                <MdSearch size={26} className='text-gray-400'/>
                <input type='text' placeholder='Search doctor by name or department' value={searchdoctor} onChange={(e)=>setsearchdoctor(e.target.value)} className='w-full py-4 pl-3 pr-4 text-base text-slate-800 placeholder-gray-400 focus:outline-none bg-transparent'></input>

            </div>
        </div>
        <div className='max-w-7xl mx-auto px-6 lg:px-20 mt-14 pb-16'>
            {loading? (
                <div className='text-center py-10'>
                    <p className='text-xl text-gray-500 font-medium'>Loading doctors</p>
                </div>
            ): filtereddoctors.length>0?(
                <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
                    {filtereddoctors.map((doc,index)=>(
                        <div key={doc._id || doc.id || index} className='bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 group'>
                            <div className='h-64 w-full bg-slate-100 overflow-hidden relative'>
                                <img src={doc.image} alt={doc.fullname} className='w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300'></img>
                            </div>
                            <div className='p-5 flex flex-col flex-grow'>
                                <h2 className='text-xl font-bold text-slate-800 mb-1'>{doc.fullname}</h2>
                                <p className='text-[#26a69a] font-semibold text-lg mb-1 '>{doc.specialization}</p>
                                <p className='text-gray-500 text-lg font-medium mb-5'>{doc.experience} Years of Experience</p>
                                {doc.status==='Available'?(
                                <Link to={`/booking/${doc._id}`}>
                                <button className='w-full mt-auto bg-[#26a69a] text-white justify-center font-semibold py-3 rounded-xl hover:bg-[#1f847b] transition-colors shadow-md flex items-center gap-1 text-lg tracking-wide'>
                                    <span>&gt;&gt; Book Now</span>
                                </button>
                                </Link>
                                ):(
                                   <button disabled className='w-full mt-auto bg-gray-300 text-gray-600 font-semibold py-3 rounded-xl cursor-not-allowed'>Not Available</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ):(
                <div className='text-center py-10'>
                    <p className='text-xl text-gray-500 font-medium'>No doctors found matching "{searchdoctor}"</p>
                </div>

            )}
        </div>

        </div>
  )
}

export default Userhome