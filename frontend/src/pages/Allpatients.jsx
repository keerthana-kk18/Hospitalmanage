import React, {useState, useEffect} from 'react'
import { MdAdd, MdFilterList, MdOutlineRemoveRedEye, MdSearch, MdOutlineEdit, MdDeleteOutline } from 'react-icons/md';
import { Link } from 'react-router-dom';
import axios from 'axios';


const Allpatients = ({onViewDoctor,onEditDoctor}) => {
    const[status,setstatus]=useState('all')
    const[searchpatient,setsearchpatient]=useState('')
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/booking/all', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setPatients(response.data.bookings || []);
            } catch (error) {
                console.error("Error fetching patients:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    const filteredPatients = patients.filter((p) => {
        const matchesSearch = p.patientDetails?.fullname.toLowerCase().includes(searchpatient.toLowerCase());
        const matchesStatus = status === 'all' || p.status.toLowerCase() === status.toLowerCase();
        return matchesSearch && matchesStatus;
    });

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10">
        <div className='flex flex-row items-center gap-4 mb-8 w-full'>
            <div className='flex-1 flex items-center bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#26a69a] w-64 transition-all'>
                <MdSearch size={24} className='text-gray-400 mr-2'/>
                <input type='text' placeholder='Search patients by name' value={searchpatient} onChange={(e)=>setsearchpatient(e.target.value)} className='bg-transparent w-full text-slate-700 font-bold text-lg focus:outline-none placeholder:text-gray-400'></input>
            </div>
            <div className='flex items-center bg-white border-2 border-gray-100 rounded-2xl px-4 py-3 shadow-sm focus-within:border-[#26a69a] w-48 md:w-64 transition-all'>
                <MdFilterList size={22} className='text-gray-400 mr-2'/>
                <select value={status} onChange={(e)=>setstatus(e.target.value)} className='bg-transparent w-full text-slate-700 font-bold text-lg focus:outline-none cursor-pointer appearance-none outline-none'>
                    <option value='all'>All</option>
                    <option value='available'>Completed</option> 
                    <option value='not available'>Pending</option>
                    <option value='not available'>Cancelled</option>
                </select>
            </div>
        </div>
        <div className='w-full overflow-x-auto rounded-2xl border border-gray-100 shadow-sm'>
            <table className='w-full text-left border-collapse bg-white'>
                <thead>
                    <tr className='bg-[#26a69a]/5 border-b border-gray-100 text-slate-700 font-bold text-lg tracking-wider'>
                    <th className='py-4 px-6'>Name</th>
                    <th className='py-4 px-6'>Age</th>
                    <th className='py-4 px-6'>Gender</th>
                    <th className='py-4 px-6'>Mobileno</th>
                    <th className='py-4 px-6'>Email</th>
                    <th className='py-4 px-6'>Doctor</th>
                    <th className='py-4 px-6'>Status</th>
                    </tr>
                </thead>
                <tbody className='divide-y divide-gray-50'>
                    {filteredPatients.map((patient)=>(
                        <tr key={patient._id} className='hover:bg-slate-50/50 transition-colors'>
                            <td className='py-4 px-6'>
                                <div className='flex items-center gap-4'> 
                                    <span className='font-bold text-slate-800 text-lg tracking-wide'>{patient.patientDetails?.fullname}</span>
                                </div>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='text-slate-600 font-semibold text-lg'>{patient.patientDetails?.age}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='text-slate-600 font-semibold text-lg'>{patient.patientDetails?.gender}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='px-3 py-2  text-slate-700 font-semibold text-lg rounded-xl '>{patient.patientDetails?.mobile}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='px-3 py-2  text-slate-700 font-semibold text-lg rounded-xl '>{patient.patientDetails?.email}</span>
                            </td>
                            <td className='py-4 px-6'>
                                <span className='px-3 py-2  text-slate-700 font-semibold text-lg rounded-xl '>{patient.doctorId?.fullname || 'N/A'}</span>
                            </td>
                           
                            <td className='py-4 px-6'>
                                <span className={`inline-block px-3 py-1 rounded-full text-lg font-bold tracking-wide ${patient.status==='Completed' || patient.status==='completed'?'bg-[#26a69a]/10 text-[#26a69a]': patient.status==='Pending'|| patient.status==='pending'?'bg-amber-500/10 text-amber-600': 'bg-rose-500/10 text-rose-500'}`}>{patient.status}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

    </div>  
    )
}

export default Allpatients