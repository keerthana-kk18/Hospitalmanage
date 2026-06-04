import React, {useState, useEffect} from 'react'
import { MdAdd, MdFilterList, MdOutlineRemoveRedEye, MdSearch, MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';

const apiurl=import.meta.env.VITE_BACKEND_URL;



const Managedoctor = ({onViewDoctor,onEditDoctor, refreshKey}) => {
    const[availability,setavailability]=useState('all')
    const[searchdoctor,setsearchdoctor]=useState('')
    const[doctors,setdoctors]=useState([])
    const[loading,setloading]=useState(true)

    useEffect(()=>{
        const fetchdoctors=async()=>{
            try{
                const token=localStorage.getItem('token') 
                const response=await axios.get(`${apiurl}/api/admin/doctors`,
                    {headers:{'Authorization': `Bearer ${token}`}
            })
            const rawdata=Array.isArray(response.data)? response.data : (response.data.doctors || response.data.data || [])
            const fetcheddata=rawdata.map((doc)=>({...doc, status:'Available'}))
            setdoctors(fetcheddata) 
        }catch(error){
            console.error("Error fetching doctors:",error)
        }finally{
            setloading(false)
        }
    }
    fetchdoctors()
},[refreshKey]);

    const filtereddoctors=doctors.filter((doc)=>{
        const searchdoc=searchdoctor.toLowerCase(); 
        const matchessearch=(doc.fullname?.toLowerCase().includes(searchdoc) || doc.specialization?.toLowerCase().includes(searchdoc))
        const matchfilter=(availability==='all' || doc.status.toLowerCase()===availability.toLowerCase())
        return matchessearch && matchfilter;
    })
     
    const handledelete=async(id)=>{
        if(window.confirm("Are you sure you want to delete this doctor?")){
            try{
                const token=localStorage.getItem('token')
                alert("Deleted successfully")
                setdoctors((prev)=>prev.filter((doc)=>doc._id!==id))
            }catch(error){
                console.error("Error deleting doctor:",error)
            }
        }
    }

    
  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className='flex flex-row items-center gap-4 mb-8 w-full'>
            <div className='flex-1 flex items-center bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#26a69a] w-64 transition-all'>
                <MdSearch size={24} className='text-gray-400 mr-2'/>
                <input type='text' placeholder='Search doctors by name or specialization' value={searchdoctor} onChange={(e)=>setsearchdoctor(e.target.value)} className='bg-transparent w-full text-slate-700 font-bold text-lg focus:outline-none placeholder:text-gray-400'></input>
            </div>
            <div className='flex items-center bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#26a69a] w-48 md:w-64 transition-all'>
                <MdFilterList size={22} className='text-gray-400 mr-2'/>
                <select value={availability} onChange={(e)=>setavailability(e.target.value)} className='bg-transparent w-full text-slate-700 font-bold text-lg focus:outline-none cursor-pointer appearance-none outline-none'>
                    <option value='all'>All</option>
                    <option value='available'>Available</option>
                    <option value='not available'>Not Available</option>
                </select>
            </div>
        </div>
        <div className='w-full overflow-x-auto rounded-2xl border border-gray-100 shadow-sm'>
            <table className='w-full text-left border-collapse bg-white'>
                <thead>
                    <tr className='bg-[#26a69a]/5 border-b border-gray-100 text-slate-700 font-bold text-lg tracking-wider'>
                    <th className='py-4 px-6'>Name</th>
                    <th className='py-4 px-6'>Specialization</th>
                    <th className='py-4 px-6'>Availability</th>
                    <th className='py-4 px-6'>Actions</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                    {loading?(
                        <tr>
                            <td colSpan='4' className='text-center py-10 text-lg text-gray-500 font-medium'>Loading doctor records...</td>
                        </tr>
                    ): filtereddoctors.length > 0 ?(
                        filtereddoctors.map((doctor)=>(
                        <tr key={doctor._id} className='hover:bg-slate-50/50 transition-colors'>
                            <td className='py-4 px-6'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-12 h-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-slate-50'>
                                        <img src={doctor.image} alt={doctor.fullname} className='w-full h-full object-cover'></img>
                                    </div>
                                    <span className='font-bold text-slate-800 text-lg tracking-wide'>{doctor.fullname}</span> 
                                </div>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='text-slate-600 font-semibold text-lg'>{doctor.specialization}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <span className={`inline-block px-3 py-1 rounded-lg text-lg font-bold tracking-wide ${doctor.status==='Available'?'bg-[#26a69a]/10 text-[#26a69a]':'bg-rose-500/10 text-rose-500'}`}>{doctor.status}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <div className='flex items-center gap-2'>
                                    <button type='button' onClick={()=> onViewDoctor && onViewDoctor(doctor)} className='p-3 bg-[#26a69a]/10 text-[#26a69a] rounded-xl hover:bg-[#26a69a]/20 transition-colors'><MdOutlineRemoveRedEye size={20}/></button>
                                    <button type='button' onClick={()=> onEditDoctor && onEditDoctor(doctor)} className='p-3 bg-amber-500/10 text-amber-600 rounded-xl hover:bg-amber-500/20 transition-colors'><MdOutlineEdit size={20}/></button>
                                    <button type='button' onClick={()=> handledelete(doctor._id)} className='p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500/20 transition-colors'><MdDeleteOutline size={20}/></button>
                                </div>
                            </td>
                        </tr>
                    ))
                ):(
                    <tr>
                        <td colSpan='5' className='text-center py-10 text-lg text-gray-500 font-medium'>No doctors found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>

    </div>  
    )
}

export default Managedoctor