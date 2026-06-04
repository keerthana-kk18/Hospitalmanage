import React, { useState, useEffect } from 'react'
import { FaRibbon } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdClose, MdMenu, MdOutlineDashboard, MdOutlineAccessTime, MdOutlineCalendarMonth, MdOutlinePerson, MdOutlineCheckCircle, MdOutlineCancel } from "react-icons/md";
import Doctorappointments from './Doctorappointments';
import Schedandavailability from './Schedandavailability';
import Doctorprofile from './Doctorprofile';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Doctordashboard = () => {
    const[activetab,setactivetab]=useState('dashboard')
    const[mobileopen,setmobileopen]=useState(false);
    const [stats, setStats] = useState({ total: 0, completed: 0, cancelled: 0 });
    const [doctorName, setDoctorName] = useState("Doctor");

    useEffect(() => {
    const fetchDashboardData = async () => {
        try {
            const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
            const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
            
            const activeUser = storedUserInfo || storedUser;
            
            if (activeUser) {
                setDoctorName(activeUser.fullname || activeUser.name || "Doctor");
                const doctorId = activeUser.id || activeUser._id;
                
                if (doctorId) {
                    const res = await axios.get(`http://localhost:5000/api/booking/doctor/${doctorId}`);
                    const bookings = res.data.bookings || res.data || [];
                    
                    const total = bookings.length;
                    const completed = bookings.filter(b => b.status?.toLowerCase() === 'completed').length;
                    const cancelled = bookings.filter(b => b.status?.toLowerCase() === 'cancelled').length;
                    
                    setStats({ total, completed, cancelled });
                }
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };
    fetchDashboardData();
}, []);

    const items=[ 
        {id:'dashboard', label:'Dahboard', icon:<MdOutlineDashboard size={24}/>},
        {id:'appointments', label:'Appointments', icon:<MdOutlineCalendarMonth size={24}/>},
        {id:'schedule', label:'Schedule & Availability', icon:<MdOutlineAccessTime size={24}/>},
        {id:'profile', label:'Profile', icon:<MdOutlinePerson size={24}/>}
    ]

    const Dashboard=()=>(
        <div>
            <div className='mb-10'>
                <h1 className='text-3xl font-extrabold text-slate-800'>Welcome, {doctorName}</h1>
                <p className='text-slate-500 text-lg mt-2 font-medium'>Here is an overview of your medical practice performance</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                <StatCard title="Total Appointments" value={stats.total} icon={<MdOutlineCalendarMonth size={28}/>} />
                <StatCard title="Completed" value={stats.completed} icon={<MdOutlineCheckCircle size={28}/>} />
                <StatCard title="Cancelled" value={stats.cancelled} icon={<MdOutlineCancel size={28}/>} />
            </div>
        </div>
    )
    const activeitem=()=>{
        switch(activetab){
            case 'dashboard':
                return <Dashboard/>;
            case 'appointments':
                return <Doctorappointments/>;
            case 'schedule':
                return <Schedandavailability/>;
            case 'profile':
                return <Doctorprofile/>;
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
                        const active=activetab===item.id;
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
const StatCard = ({ title, value, icon }) => (
    <div className='bg-white p-6 rounded-2xl border border-slate-100 shadow-lg flex items-center justify-between'>
        <div className='flex flex-col gap-1'>
            <span className='text-lg font-bold text-slate-400'>{title}</span>
            <h2 className='text-3xl font-extrabold text-slate-800 mt-1'>{value}</h2>
        </div>
        <div className='p-4 bg-teal-50 rounded-xl text-[#26a69a]'>{icon}</div>
    </div>
);

export default Doctordashboard