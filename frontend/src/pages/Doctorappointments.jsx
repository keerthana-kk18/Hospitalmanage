import React, {  useState, useEffect } from 'react'
import { FaEye, FaRibbon, FaUserInjured } from 'react-icons/fa6'
import { FaFileMedical, FaCloudUploadAlt } from 'react-icons/fa';
import { MdAssignment, MdClose, MdCake, MdWc, MdPhone, MdMail } from 'react-icons/md';
import { LuLogOut } from "react-icons/lu";
import { MdFilterList } from 'react-icons/md';
import axios from 'axios';

const apiurl=import.meta.env.VITE_BACKEND_URL;


const Doctorappointments = ({doctorId}) => {
    const [appointments, setappointments] = useState([]);
    const[filteredappointments,setfilteredappointments]=useState([])
    const[filterstatus,setfilterstatus]=useState('all')
    const[loading,setloading]=useState(true)
    const[uploading,setuploading]=useState(null)
    const[selectedappointment,setselectedappointment]=useState(null)
    const [showmodal, setshowmodal] = useState(false);

    useEffect(() => {
        const fetchappointments = async () => {
            try{
                setloading(true);
                const userinfosession = JSON.parse(localStorage.getItem('userInfo') || null);
                const usersession =  JSON.parse(localStorage.getItem('user') || null);
                const activeDoctorId = doctorId || localStorage.getItem('doctorid') || userinfosession?.id || usersession?.id || userinfosession?._id || usersession?._id;

            console.log("DEBUG: Final Doctor ID used for API call:", activeDoctorId);
            if (!activeDoctorId) {
                setloading(false);
                return;
            }
                const response = await axios.get(`${apiurl}/api/booking/doctor/${activeDoctorId}`);

               console.log("DEBUG: API Response data:", response.data);
                
                const targetBookings = response.data.bookings || response.data.booking || response.data || [];
                const finalArray = Array.isArray(targetBookings) ? targetBookings : [targetBookings];
                setappointments(finalArray);
                setfilteredappointments(finalArray);
            }catch(error) {
                console.error("Error fetching doctor appointments:", error);
            }finally{
                setloading(false);
            }
        }


        fetchappointments();
    
    }, [doctorId]);

    const handlefilter = (status) => {
        setfilterstatus(status);
        if(status=== 'all'){
            setfilteredappointments(appointments);
        }else{
            setfilteredappointments(
                appointments.filter(app=>app.status?.toLowerCase()=== status.toLowerCase())
            )
        }
    }

    const openpatientmodal=(appointment)=>{
        setselectedappointment(appointment);
        setshowmodal(true);
    }

    const handlefileUpload = async (e, id) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("medicalrecord", file);

    try {
        setuploading(id);  
        const res = await axios.post(`${apiurl}/api/booking/${id}/upload`, formData);
        const newUrl = res.data.path;
        
        await axios.patch(`${apiurl}/api/booking/${id}/status`, { status: 'Completed' });

        setappointments(prev => prev.map(app => 
            app._id === id ? { ...app, medicalrecord: newUrl, status: 'Completed' } : app
        ));
        setfilteredappointments(prev => prev.map(app => 
            app._id === id ? { ...app, medicalrecord: newUrl, status: 'Completed' } : app
        ));
        
        setselectedappointment(prev => ({ ...prev, medicalrecord: newUrl, status: 'Completed' }));

        alert("Upload successful!");
        setuploading(null);
    } catch (error) {
        console.error(error);
        alert("Upload failed.");
        setuploading(null);
    }
};

const downloadPrescription = async (fullUrl) => {
    try {
        const parts = fullUrl.split('/upload/');
        const pathPart = parts[1].split('/').slice(1).join('/'); // removes 'v12345/'
        const publicId = pathPart.split('.')[0]; // removes '.pdf'

        const res = await axios.get(`${apiurl}/api/booking/get-signed-url/${encodeURIComponent(publicId)}`);
        
        const link = document.createElement('a');
        link.href = res.data.signedUrl;
        link.setAttribute('download', 'Medical_Record.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (err) {
        console.error("Download failed:", err);
        alert("Could not generate secure download link. Please check backend logs.");
    }
};

  return (
    <div className='max-w-7xl mx-auto px-6 mt-12'>
        <div className='bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-6 mb-8'>
                <div>
                    <h1 className='text-2xl font-bold text-slate-800'>Your booked appointments</h1>
                    <p className='text-gray-400 text-lg mt-1'>Review checkups scheduled by your patients</p>
                </div>
                <div className='flex items-center gap-2 bg-slate-50 border border-gray-200 rounded-xl px-4 py-2 self-start sm:self-auto min-w-[200px] shadow-sm'>
                    <MdFilterList size={22} className='text-gray-400'/>
                    <select value={filterstatus} onChange={(e)=> handlefilter(e.target.value)} className='bg-transparent text-slate-700 font-bold text-lg focus:outline-none w-full cursor-pointer'>
                        <option value='all'>All Appointments</option>
                        <option value='pending'>Pending</option>
                        <option value='completed'>Completed</option>
                        <option value='cancelled'>Cancelled</option>
                    </select>
                </div>
            </div>
            {loading? (
                <div className='text-center py-10 font-medium text-gray-500 text-lg'>Loading appointments</div>
            ):filteredappointments.length===0?(
                <div className='text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl'>
                    <FaUserInjured size={40} className='mx-auto text-gray-300 mb-3'/>
                    <p className='text-gray-400 font-medium text-lg'>No appointments found</p>
                </div>
            ):(
                <div className='overflow-x-auto rounded-xl border border-gray-100'>
                    <table className='w-full text-left border-collapse'>
                        <thead className='bg-slate-50 text-gray-400 text-lg font-bold tracking-wider'>
                            <tr>
                                <th className='px-6 py-4'>Patient Name</th>
                                <th className='px-6 py-4'>Scheduled Date</th>
                                <th className='px-6 py-4'>Time Slot</th>
                                <th className='px-6 py-4'>Status</th>
                                <th className='px-6 py-4'>Actions</th>
                            </tr>
                        </thead>
                        <tbody className='divide-y divide-gray-100 text-slate-800 font-medium'>
                            {filteredappointments.map((appointment)=>(
                                <tr key={appointment._id} className='hover:bg-slate-50/70 transition-colors'>
                                    <td className='px-6 py-4 font-bold text-slate-800'>{appointment.patientDetails?.fullname || 'Unknown patient'}</td>
                                    <td className='px-6 py-4 text-gray-500'>{appointment.dateString ? new Date(appointment.dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</td>
                                    <td className='px-6 py-4 text-gray-600'>{appointment.timeSlot}</td>
                                    <td className='px-6 py-4 text-center'>
                                        <span className={`inline-block px-3 py-1 rounded-full text-lg font-bold tracking-wide  ${
                                                    appointment.status?.toLowerCase()=== 'completed'? 'bg-emerald-50 text-emerald-600': 
                                                    appointment.status?.toLowerCase()=== 'pending'? 'bg-amber-50 text-amber-600': 'bg-rose-50 text-rose-600'
                                                }`}>{appointment.status || 'pending'}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 flex items-center justify-center gap-2'>
                                        <button onClick={()=>openpatientmodal(appointment)} className='flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-all text-lg shadow-sm'>
                                            <FaEye size={14}/>
                                            <span>View Details</span>
                                        </button>
                                    </td>
                                </tr>
                            
                        ))} 
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    
    {showmodal && selectedappointment &&(
        <div className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
            <div className='bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all flex flex-col max-h-[90vh]'>
                <div className='bg-slate-50 px-6 py-5 border-b border-gray-100 flex items-center justify-between'>
                    <div className='flex items-center gap-2 text-[#26a69a]'>
                        <MdAssignment size={24} />
                        <h2 className='text-xl font-bold text-slate-800'>Patient Case Profile</h2>
                    </div>
                    <button onClick={()=>setshowmodal(false)} className='text-gray-400 hover:text-slate-800 focus:outline-none p-1 bg-white border border-gray-200 rounded-full shadow-sm'>
                        <MdClose size={20}/>
                    </button>
                    </div>
                    <div className='p-6 overflow-y-auto flex flex-col gap-6'>
                        <div className='grid grid-cols-2 gap-4 bg-slate-50/60 p-4 rounded-2xl border border-gray-100'>
                            <div className='col-span-2 flex flex-col gap-1'>
                                <span className='text-xs font-bold  tracking-wider text-gray-400'>Name</span>
                                <span className='text-lg font-bold text-slate-800'>{selectedappointment.patientDetails?.fullname || 'N/A'}</span>
                            </div>
                            <hr className='col-span-2 border-gray-100 my-1'/>
                            <div className='flex flex-col gap-1'>
                                <span className='text-lg font-bold tracking-wider text-gray-400 flex items-center gap-1'><MdCake/> Age</span>
                                <span className='text-lg font-bold text-slate-700'>{selectedappointment.patientDetails?.age || 'Not Specified'} Yrs</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-lg font-bold tracking-wider text-gray-400 flex items-center gap-1'><MdWc/> Gender</span>
                                <span className='text-lg font-bold text-slate-700 '>{selectedappointment.patientDetails?.gender || 'Not Specified'}</span>
                            </div>
                            <hr className='col-span-2 border-gray-100 my-1'/>
                            <div className='flex flex-col gap-1'>
                                <span className='text-lg font-bold tracking-wider text-gray-400 flex items-center gap-1'><MdPhone/> Mobile Number</span>
                                <span className='text-lg font-bold text-slate-700'>{selectedappointment.patientDetails?.mobile || 'N/A'}</span>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <span className='text-lg font-bold tracking-wider text-gray-400 flex items-center gap-1'><MdMail/> Email </span>
                                <span className='text-lg font-bold text-slate-700 truncate'>{selectedappointment.patientDetails?.email || 'N/A'}</span>
                            </div>
                         </div>
                         <div className='flex flex-col gap-3 pt-4 border-t border-gray-100'>
                            <h2 className='text-lg font-bold tracking-wider text-gray-400'>Prescription & Medical Records</h2>
                                {selectedappointment.medicalrecord? (
                                    <div className='flex items-center justify-between p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl'>
                                        <div className='flex items-center gap-2 text-emerald-700'>
                                            <FaFileMedical size={20}/>
                                            <span className='font-bold text-lg'>Prescription Attached</span>
                                        </div>
                                        <button
                                            onClick={() => {
                                            if (selectedappointment?.medicalrecord) {
                                            window.open(selectedappointment.medicalrecord, "_blank");
                                            } else {
                                                 alert("No document found.");
                                                }
                                            }}>
                                            Download Document
                                        </button>
                                    </div>
                                ): selectedappointment.status?.toLowerCase()=== 'cancelled'? (
                                    <div className='text-center py-3 text-gray-400 text-lg'>Appointment was cancelled</div>
                                ):(
                                    <div className='w-full'>
                                        <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
                                            uploading=== selectedappointment._id 
                                            ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed': 'bg-slate-50 border-gray-300 text-slate-500 hover:border-[#26a69a] hover:bg-teal-50/30'}`}>
                                            <div className='flex flex-col items-center justify-center pt-5 pb-6 gap-1'>
                                                <FaCloudUploadAlt size={32} className={uploading=== selectedappointment._id? 'text-gray-300': 'text-[#26a69a]'}/>
                                                <p className='text-lg font-bold text-slate-700 mt-1'>{uploading=== selectedappointment._id? 'Uploading Files': 'Click to Upload Digital Prescription'}</p>
                                                <p className='text-lg text-gray-400 font-medium'>PDF, PNG, JPG file</p>
                                            </div>
                                            <input type="file" accept=".pdf,.png,.jpg,.jpeg" disabled={uploading=== selectedappointment._id} onChange={(e) => handlefileUpload(e, selectedappointment._id)} className="hidden" ></input>
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                   </div>
               </div>
    )}
    </div>
  )
}

export default Doctorappointments