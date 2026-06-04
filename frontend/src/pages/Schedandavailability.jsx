import React, { useState, useEffect } from 'react';
import { MdOutlineCalendarMonth, MdOutlineAccessTime, MdDeleteOutline, MdClose, MdAdd } from 'react-icons/md';
import { FaRegSave } from 'react-icons/fa';
import axios from 'axios';

const Schedandavailability = () => {
    const[available,setavailable]=useState(true);
    const[schedules,setschedules]=useState([])
    const[newdate,setnewdate]=useState(new Date().toISOString().split('T')[0])
    const[newslots,setnewslots]=useState({})

    const userinfosession=localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')): null;
    const usersession=localStorage.getItem('user')? JSON.parse(localStorage.getItem('user')):null;
    const doctorid=localStorage.getItem('doctorid') || userinfosession?.id || usersession?.id || userinfosession?._id || usersession?._id 
    const fetchschedules = async () => {
    try {
        if (!doctorid) return;
        const response = await axios.get(`http://localhost:5000/api/schedule/doctor/${doctorid}`);
        const rawArray = response.data.schedules || response.data.schedule || response.data || [];
        const dataArray = Array.isArray(rawArray) ? rawArray : [rawArray];
        
        const normalizedSchedules = dataArray.map(sched => {
            const rawSlots = sched.slots || sched.timeslots || sched.timeSlots || [];
            
            const parsedSlots = rawSlots.map(slot => {
                if (typeof slot === 'object' && slot !== null) {
                    return slot.time || slot.slot || slot.timeslot || JSON.stringify(slot);
                }
                return slot;
            });

            return {
                ...sched,
                dateString: sched.dateString,
                displayDate: sched.displayDate || sched.displaydate,
                slots: parsedSlots
            };
        });

        setschedules(normalizedSchedules);
    } catch (error) {
        console.error("Error fetching schedules:", error.response?.data?.message || error.message);
    }
};

    useEffect(()=>{
        fetchschedules()
    }, [doctorid])

    const formatdisplaydate=(dateStr)=>{
        const options={weekday:'short', month:'short', day:'numeric'}
        return new Date(dateStr).toLocaleDateString('en-US',options)
    }

    const handleadddate=async()=>{
        if(!newdate){
            alert('Please select a valid date')
             return;
        }
        if (!doctorid) {
        alert("Authentication Error: Doctor ID could not be found. Please log in again");
        return;
    }
    const dateExists = schedules.some(sched => sched.dateString === newdate);
        if (dateExists) {
            alert("This date is already active in your schedule. You can manage or add slots inside its card directly.");
            return;
        }
        const displaydate=formatdisplaydate(newdate)
        try{
            const response=await axios.post('http://localhost:5000/api/schedule/adddate',{doctorid, dateString:newdate, displaydate})
            const targetdata = response.data.schedule || response.data.schedules || response.data;
            const savedschedule={...targetdata, displayDate:targetdata.displayDate || targetdata.displaydate, slots:targetdata.slots || []}
            setschedules([...schedules, savedschedule])
        }catch(error){
            console.error("Catch block caught an error: ",error)         
            alert(error.response?.data?.message || 'Failed to add date. Please try again.')
        }
    }

    const handledeletedate=async(dateString)=>{
        try{
            await axios.delete('http://localhost:5000/api/schedule/deletedate',{data:{doctorid, dateString}})
            setschedules(schedules.filter(sched=>sched.dateString!==dateString))
        }catch(error){
            alert(error.response?.data?.message || 'Failed to delete date. Please try again.')
        }
    }

    const handleaddslot=async(dateString)=>{
        const rawtime=newslots[dateString]
        if(!rawtime) {
            alert('Please enter a time slot')
            return;
        }
        const[hoursstr,minutesstr]=rawtime.split(':')
        let hours=parseInt(hoursstr,10)
        const ampm=hours>=12? 'PM':'AM'
        hours=hours%12 || 12
        const timeslot=`${hours}:${minutesstr} ${ampm}`
        try{
            const response=await axios.post('http://localhost:5000/api/schedule/addslot',{doctorid, dateString, timeslot})
            const backendDoc=response.data.schedule || response.data
            const updatedschedule = {...backendDoc, displayDate: backendDoc.displayDate || backendDoc.displaydate, slots: backendDoc.slots || []};            
            setschedules(schedules.map(sched=>sched.dateString===dateString? updatedschedule : sched))
            setnewslots({...newslots, [dateString]:''})
        }catch(error){
            alert(error.response?.data?.message || 'Failed to add time slot. Please try again.')
        }
    }

    const handledeleteslot=async(dateString,timeslot)=>{
        try{
            const response=await axios.delete('http://localhost:5000/api/schedule/deleteslot',{data:{doctorid, dateString, timeslot}})
            const backendDoc=response.data.schedule
            const updatedschedule = {...backendDoc,dateString: backendDoc.dateString || dateString,displayDate: backendDoc.displayDate || backendDoc.displaydate,slots: backendDoc.slots || []};      
            setschedules(schedules.map(sched=>sched.dateString===dateString? updatedschedule : sched))
        }catch(error){
            alert(error.response?.data?.message || 'Failed to delete slot. Please try again.')
        }
    }
    const handlesaveprofile = async () => {
    try {
        const token = localStorage.getItem('token');
        const statusToSave = available ? 'Available' : 'Not Available';
        await axios.put('http://localhost:5000/api/doctor/updateavailability', 
            { isAvailable: available }, // Send the boolean
            { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("Schedule and status saved successfully!");
    } catch (error) {
        console.error("Error saving profile:", error);
        alert("Failed to save. Please try again.");
    }
};
  return (
    <div className='bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10 w-full md:mt-24 sm:mt-20'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-6 mb-8'>
            <div className='flex items-center gap-3'>
                <div className='p-2 bg-[#26a69a]/10 text-[#26a69a] rounded-xl'>
                <MdOutlineCalendarMonth size={28}/>
                </div>
                <h1 className='text-2xl font-extrabold text-slate-800 tracking-wide'>Schedule & Availability</h1>
            </div>
            <div className='flex flex-wrap items-center gap-3 self-start lg:self-auto'>
                <div className='flex items-center bg-slate-100 p-1 rounded-xl border border-gray-200 shadow-sm'>
                    <button type='button' onClick={()=>setavailable(true)} className={`px-4 py-2 font-bold text-lg rounded-lg transition-all ${ available? 'bg-[#26a69a] text-white shadow-sm': 'text-slate-600 hover:text-slate-800'}`}>Available</button>
                    <button type='button' onClick={()=>setavailable(false)} className={`px-4 py-2 font-bold text-lg rounded-lg transition-all ${ !available? 'bg-rose-500 text-white shadow-sm': 'text-rose-500 hover:text-slate-800'}`}>Not Available</button>
                </div>
            </div>
            <div className='flex items-center bg-white border border-gray-200 rounded-xl px-3 py-2 shadow-sm focus-within:border-[#26a69a] transition-all'>
                <input type='date' value={newdate} onChange={(e)=>setnewdate(e.target.value)} className='bg-transparent text-slate-700 font-bold text-lg focus:outline-none cursor-pointer outline-none'></input>
            </div>
            <button type='button' onClick={handleadddate} className='flex items-center gap-2 px-4 py-3 bg-[#26a69a] text-white font-bold text-lg rounded-xl hover:bg-[#208c81] transition-all shadow-md shadow-teal-600/10'>
                <MdAdd size={18}/>
                <span>Add Date</span>
            </button>
        </div>
        
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-10'>
            {Array.isArray(schedules) && schedules.map((sched)=>(
            <div key={sched._id || sched.dateString} className='bg-[#26a69a]/5 border border-[#26a69a]/10 rounded-2xl p-5 flex flex-col gap-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                        <div className='p-2 bg-[#26a69a]/10 text-[#26a69a] rounded-xl'>
                            <MdOutlineCalendarMonth size={22}/>
                        </div>
                        <div className='flex flex-col'>
                            <span className='font-bold text-slate-800 text-lg'>{sched.displayDate || sched.displaydate}</span>
                            <span className='text-sm font-medium text-gray-400 mt-1'>{sched.dateString}</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <span className='px-2 py-1 bg-[#26a69a]/10 text-[#26a69a] text-lg font-bold rounded-lg'>{sched.slots?.length || 0} {sched.slots?.length===1?'Slot':'Slots'}</span>
                        <button type='button' onClick={()=>handledeletedate(sched.dateString)} className='text-rose-400 hover:text-rose-600 p-1 transition-colors'>
                            <MdDeleteOutline size={20}/>
                        </button>
                    </div>
                </div>
                <div className='flex flex-col gap-3'>
                    {(sched.slots || []).map((slot,index)=>(
                    <div key={index} className='flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm group hover:border-[#26a69a] transition-colors'>
                        <div className='flex items-center gap-2 text-slate-700 font-bold text-lg'>
                            <MdOutlineAccessTime size={20} className='text-gray-400'/>
                            <span>{slot}</span>
                        </div>
                        <button type='button' onClick={()=>handledeleteslot(sched.dateString, slot)} className='text-gray-300 hover:text-rose-500 transition-colors'>
                            <MdClose size={18}/>
                        </button>
                    </div> 
                    ))}
                    <div className='flex items-center gap-2 mt-2'>
                        <div className='flex-1 flex items-center justify-between bg-white border border-gray-300 rounded-xl px-4 shadow-sm'>
                            <input type='time' value={newslots[sched.dateString] || ''} onChange={(e) => setnewslots({ ...newslots, [sched.dateString]: e.target.value })} className='w-full font-semibold text-slate-700 focus:outline-none bg-transparent cursor-pointer'></input>
                            <MdOutlineAccessTime size={20} className='text-gray-400'/>
                        </div>
                        <button type='button' onClick={() => handleaddslot(sched.dateString)} className='p-2 bg-[#26a69a]/10 text-[#26a69a] rounded-xl hover:bg-[#26a69a]/20 transition-colors'>
                           <MdAdd size={20}/></button> 
                    </div>
                </div>
            </div>
       ))}
        </div>
        <div className='flex items-center justify-between pt-6 border-t border-gray-100'>
            <p className='text-lg font-bold text-slate-400'>Make changes and save your profile</p>
            <button type='button' onClick={handlesaveprofile} className='flex items-center gap-2 px-6 py-4 bg-[#26a69a] text-white font-bold text-lg rounded-xl hover:bg-[#208c81] transition-all shadow-md shadow-teal-600/10'>
                <FaRegSave size={18}/>
                <span>Save Profile</span>
            </button>

        </div>
    </div>
    
  )
}

export default Schedandavailability