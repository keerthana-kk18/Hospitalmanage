import React, {useEffect, useState} from 'react'
import { FaRibbon } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { MdPerson } from "react-icons/md";
import { MdClose, MdMenu, MdOutlineCheck, MdOutlineCancel, MdOutlineLock, MdOutlineMail, MdOutlineEdit } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const apiurl=import.meta.env.VITE_BACKEND_URL;



const Profile = () => {
    const[open,setopen]=useState(false);
    const[edit,setedit]=useState(false);
    const location=useLocation();
    const[name,setname]=useState('')
    const[email,setemail]=useState('')
    const[password,setpassword]=useState('')
    const[role,setrole]=useState('user')

    useEffect(()=>{
        const storeduser=localStorage.getItem('userInfo')
        if(storeduser){
            const parseduser=JSON.parse(storeduser)
            setname(parseduser.name|| '')
            setemail(parseduser.email|| '')
            setrole(parseduser.role || 'user')
        }
    },[])

    const handleprofile=async()=>{
        try{
            const token=localStorage.getItem('token')
            const storeduser=JSON.parse(localStorage.getItem('userInfo'))
            const updatedata={name:name.trim(), email:email.toLowerCase().trim()}
        
        if(password){
            updatedata.password=password
        }
        const response=await axios.put(`${apiurl}/api/user/profile`,updatedata,{headers:{Authorization:`Bearer ${token}`}}
        )
        if(response.status===200){
            const updateuser={...storeduser, name:name, email:email}
            localStorage.setItem('userInfo',JSON.stringify(updateuser))
            alert('Profile updated successfully')
            setpassword('')
            setedit(false)
        }
    }catch(error){
        alert(error.response?.data?.message || 'Failed to save changes. PLease try again')
    }
}
const handlecancel=()=>{
    const storeduser=localStorage.getItem('userInfo')
    if(storeduser){
        const parseduser=JSON.parse(storeduser)
        setname(parseduser.name || '')
        setemail(parseduser.email || '')
    }
    setpassword('');
    setedit(false);
}

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
           <div className='max-w-4xl mx-auto px-6 mt-20'>
            <div className='bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10'>
                <div className='flex justify-between items-center border-b border-gray-100 pb-6 mb-8'>
                    <div>
                        <h1 className='text-2xl font-bold text-slate-800'>Security Settings</h1>
                        <p className='text-gray-400 text-sm mt-1'>Manage your account access credentials</p>
                    </div>
                    {!edit &&(
                        <button onClick={()=>setedit(true)} className='flex items-center gap-2 bg-teal-50 text-[#26a69a] font-bold text-lg px-4 py-2 rounded-xl hover:bg-[#26a69a] hover:text-white transition-all'>
                            <MdOutlineEdit size={18}/>
                            <span>Edit</span>
                        </button>
                    )}
                </div>
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-bold text-gray-400 flex items-center gap-2 pl-1'>
                            <MdPerson size={20} className='text-gray-400'/>Name</label>
                        <input type='text' disabled={!edit} value={name} onChange={(e)=>setname(e.target.value)} className={`w-full font-medium px-5 py-4 rounded-xl border transition-all text-slate-800  ${
                                edit? 'bg-white border-[#26a69a] focus:outline-none shadow-lg ': 'bg-slate-50 border-gray-200 curser-not-allowed text-gray-500'}`}></input>
                    </div>

                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-bold text-gray-400 flex items-center gap-2 pl-1'>
                            <MdOutlineMail size={20} className='text-gray-400'/>Registered Email</label>
                            <input type='email' disabled={!edit} value={email} onChange={(e)=>setemail(e.target.value)} className={`w-full font-medium px-5 py-4 rounded-xl border transition-all text-slate-800  ${
                                edit? 'bg-white border-[#26a69a] focus:outline-none shadow-lg ': 'bg-slate-50 border-gray-200 curser-not-allowed text-gray-500'}`}></input>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <label className='text-lg font-bold text-gray-400 flex items-center gap-2 pl-1'>
                            <MdOutlineLock size={20} className='text-gray-400'/>Account Password</label>
                            <input type={edit? 'text': 'password'} disabled={!edit} value={password}  placeholder={edit? 'Enter new password(leave blank to keep current)':'......'} onChange={(e)=>setpassword(e.target.value)}
                            className={`w-full font-medium px-5 py-4 rounded-xl border transition-all text-slate-800 ${edit? 'bg-white border-[#26a69a] focus:outline-none shadow-lg placeholder-gray-300': 'bg-slate-50 border-gray-200 cursor-not-allowed text-gray-400  text-lg'}`}></input>
                    </div>
                    {edit &&(
                        <div className='flex justify-end gap-3 mt-4 pt-6 border-t border-gray-100'>
                            <button type='button' onClick={handlecancel} className='flex items-center gap-1 px-4 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors text-lg'>
                                
                                <span>Cancel</span>
                            </button>
                            <button type='button' onClick={handleprofile} className='flex items-center gap-1 px-5 py-3 bg-[#26a69a] text-white font-bold rounded-xl hover:bg-[#1f847b] transition-colors text-lg shadow-lg'>
                            
                                <span>Save</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
           </div>
    </div>
  )
}

export default Profile