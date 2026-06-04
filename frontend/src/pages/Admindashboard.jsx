import React, { useState, useEffect } from 'react'
import { FaRibbon } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdClose, MdMenu, MdOutlineDashboard, MdOutlineAccessTime, MdOutlineCalendarMonth, MdOutlinePerson, MdOutlineCheckCircle, MdOutlineCancel, MdAdd, MdArrowBack } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { RiGroupFill } from "react-icons/ri";
import Managedoctor from './Managedoctor';
import Adddoctor from './Adddoctor';
import Doctorview from './Doctorview';
import Doctoredit from './Doctoredit';
import AllPatients from './Allpatients';
import axios from 'axios';
import { Link } from 'react-router-dom';

const apiurl=import.meta.env.VITE_BACKEND_URL;



const Admindashboard = () => {
    const[activetab,setactivetab]=useState('dashboard')
    const[mobileopen,setmobileopen]=useState(false);
    const[selecteddoctor,setselecteddoctor]=useState(null)
    const [refreshKey, setRefreshKey] = useState(0);
    const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${apiurl}/api/booking/dashstats`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
        };
        fetchStats();
    }, []);

    const handleDoctorUpdated = (updatedDoctor) => {
        console.log("Doctor updated successfully!", updatedDoctor);
        setRefreshKey(prev => prev + 1); 
        setactivetab('managedoctor');  
    };

    const items=[ 
        {id:'dashboard', label:'Dahboard', icon:<MdOutlineDashboard size={24}/>},
        {id:'managedoctor', label:'Manage Doctor', icon:<FaUserDoctor size={24}/>},
        {id:'adddoctor', label:'Add Doctor', icon:<MdAdd size={24}/>},
        {id:'All Patients', label:'All Patients', icon:<RiGroupFill size={24}/>},
    ]
    const handleviewdoctor=(id)=>{
        setselecteddoctor(id);
        setactivetab('doctorview');
    }
    const handleeditdoctor=(doctor)=>{
        setselecteddoctor(doctor);
        setactivetab('doctoredit');
    }

    const Dashboard=()=>(
        <div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-lg flex items-center justify-between transition-all duration-200 hover:shadow-lg lg:mt-36'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-lg font-bold text-slate-400'>Total Appointments</span>
                        <h2 className='text-3xl font-extrabold text-slate-800 mt-1'>{stats.total}</h2>
                    </div>
                    <div className='p-4 bg-teal-50 rounded-xl text-[#26a69a]'>
                        <MdOutlineCalendarMonth size={28}/>
                    </div>
                </div>
                <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-lg flex items-center justify-between transition-all duration-200 hover:shadow-lg lg:mt-36'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-lg font-bold text-slate-400'>Completed</span>
                        <h2 className='text-3xl font-extrabold text-slate-800 mt-1'>{stats.completed}</h2>
                    </div>
                    <div className='p-4 bg-teal-50 rounded-xl text-[#26a69a]'>
                        <MdOutlineCheckCircle size={28}/>
                    </div>
                </div>
                 <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-lg flex items-center justify-between transition-all duration-200 hover:shadow-lg lg:mt-36'>
                    <div className='flex flex-col gap-1'>
                        <span className='text-lg font-bold text-slate-400'>Cancelled</span>
                        <h2 className='text-3xl font-extrabold text-slate-800 mt-1'>{stats.cancelled}</h2>
                    </div>
                    <div className='p-4 bg-teal-50 rounded-xl text-[#26a69a]'>
                        <MdOutlineCancel size={28}/>
                    </div>
                </div>
            </div>
        </div>
    )
    const activeitem=()=>{
        switch(activetab){
            case 'dashboard':
                return <Dashboard/>;
            case 'managedoctor':
                return <Managedoctor onViewDoctor={handleviewdoctor} onEditDoctor={handleeditdoctor} refreshKey={refreshKey}/>;
            case 'adddoctor':
                return <Adddoctor/>;
            case 'doctorview':
                return(
                    <div className='flex flex-col gap-4'>
                        <button onClick={()=>setactivetab('managedoctor')} className='flex items-center gap-2 self-start px-4 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-slate-700 font-bold text-sm rounded-xl transition-all shadow-sm'>
                            <MdArrowBack size={20}/>
                            <span>Back to Doctors</span>
                        </button>
                        <Doctorview doctor={selecteddoctor}/>
                    </div>
                )
            case 'doctoredit':
                return(
                    <div className='flex flex-col gap-4'>
                        <Doctoredit doctor={selecteddoctor} onCancel={()=>setactivetab('managedoctor')} onUpdate={handleDoctorUpdated}/>
                    </div>
                )
            case 'All Patients':
                return <AllPatients/>;
            default:
                return <Dashboard/>;
        }
    }

    
  return (
    <div className='min-h-screen bg-slate-50 flex flex-col md:flex-row relative'>
        <div className='md:hidden w-full h-16 bg-white shadow-lg px-6 flex items-center justify-between z-40 fixed top-0 left-0'>
            <div className='flex items-center gap-2'>
                <FaRibbon size={24} color='#26a69a'/>
                <span className='text-xl font-bold text-slate-800'>Medicare</span>
            </div>
            <button onClick={()=>setmobileopen(!mobileopen)} className='text-slate-800 focus:outline-none'>{mobileopen? <MdClose size={28}/>: <MdMenu size={28}/>}</button>
        </div>
        <aside className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#26a69a] border-r border-slate-100 flex flex-col justify-between p-6 transition-transform duration-300 md:translate-x-0 ${mobileopen? 'translate-x-0 pt-20 md:pt-6': '-translate-x-full'}`}>
            <div className='flex flex-col gap-10'>
                <div className='hidden md:flex items-center gap-2 px-2'>
                    <FaRibbon size={28} color='black'/>
                    <span className='text-2xl font-bold text-black'>Medicare</span>
                </div>
                <nav className='flex flex-col gap-2 w-full'>
                    {items.map((item)=>{
                        const active=activetab===item.id || (item.id==='managedoctor' && activetab==='doctorview')
                        return(
                            <button key={item.id} onClick={()=>{
                                setactivetab(item.id);
                                setmobileopen(false);
                            }} className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl font-bold tracking-wider text-lg  transition-all group text-left ${active? 'bg-white text-[#26a69a]': 'text-white hover:bg-slate-50 hover:text-[#26a69a]'}`}>
                                <span className={`${active? 'text-[#26a69a]': 'text-white group-hover:text-[#26a69a]'}`}>{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        )
                    })}
                </nav>
            </div>
            <div className='border-t border-slate-100 pt-4 w-full'>
                <Link to='/'>
                <button className='w-full flex items-center gap-4 px-4 py-4 font-bold text-red-500 bg-white/50 hover:bg-red-50/50 rounded-xl text-left'>
                <LuLogOut size={22} className='text-red-500'/>
                <span>Logout</span></button>
                </Link>
            </div>
        </aside>
        {mobileopen &&(
            <div className='fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden' onClick={()=>setmobileopen(false)}></div>
        )}
        <main className='flex-1 md:ml-72 min-h-screen pt-20 md:pt-0 p-6 lg:p-12 transition-all duration-300'>
            <div className='max-w-6xl mx-auto'>{activeitem()}</div>
        </main>
    </div>
  )
}

export default Admindashboard