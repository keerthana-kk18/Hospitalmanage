import React, {useState, useEffect} from 'react'
import { FaRibbon,FaFilePdf } from "react-icons/fa6";
import { LuDownload, LuEye, LuLogOut } from "react-icons/lu";
import { MdClose, MdSearch } from "react-icons/md";
import { MdMenu } from "react-icons/md";
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const Medicalrecords = () => {
    const[records,setrecords]=useState([]);
    const[open,setopen]=useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const location=useLocation();
useEffect(() => {
        fetchRecords();
    }, []);
    const fetchRecords = async () => {
        const token = localStorage.getItem('token');
        console.log("Token being sent:", token)

    if(!token) {
        alert("Session expired. Please log in again.");
        window.location.href = '/login';
        return;
    }
    try{
        const userString = localStorage.getItem('userInfo'); 
        const user = JSON.parse(userString)
        const userEmail = user?.email; 
        if (!userEmail) {
            console.error("Email not found in userInfo!");
            return;
        }
        const res = await axios.get(`http://localhost:5000/api/booking/medicalrecords`, {
            params: { email: userEmail },
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });        
        setrecords(res.data.records);
    } catch (error) {
        console.error("Error fetching records:", error);
    }
};

const handleviewpdf = (url) => {
    console.log("handleviewpdf called with:", url);
    
    if (!url) {
        alert("The URL is missing or empty.");
        return;
    }
    setSelectedImage(url);
};

const downloadImage = async (url, filename) => {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename || 'medical-record.png');
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Download failed:", error);
        alert("Could not download the file.");
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

            <div className='max-w-7xl mx-auto px-6 lg:px-20 mt-12'>
                <div className='mb-8'>
                    <h1 className='text-3xl font-bold text-slate-800'>Your Medical Records</h1>
                    <p className='text-gray-500 mt-1'>Manage and view prescriptions issued by your consulting physicians</p>
                </div>
                {records.length===0?(
                    <div className='w-full bg-white rounded-2xl shadow-md border border-slate-100 p-12 text-center flex flex-col items-center justify-center min-h-[300px]'>
                        <div className='w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mb-4'>
                            <FaFilePdf size={28} colo='#26a69a'/>
                        </div>
                        <h2 className='text-xl font-semibold text-slate-800 mb-1'>No Records available</h2>
                        <p className='text-gray-500 max-w-sm mx-auto'>Your medical records and prescriptions will appear here once uploaded by a doctor</p>
                        </div>
                ):(
                    <div className='w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden'>
                        <div className='overflow-x-auto m-2'>
                            <table className='w-full text-left border-collapse min-w-[600px]'>
                                <thead>
                                    <tr className='border-b border-gray-100 bg-slate-50/70'>
                                        <th className='px-6 py-4 text-lg font-semibold text-gray-600 rounded-l-xl'>Document Title</th>
                                        <th className='px-6 py-4 text-lg font-semibold text-gray-600'>Prescribing Doctor</th>
                                        <th className='px-6 py-4 text-lg font-semibold text-gray-600'>Issue Date</th>
                                        <th className='px-6 py-4 text-lg font-semibold text-gray-600 rounded-l-xl'>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-100'>
                                    {records.map((record)=>
                                        <tr key={record._id} className='hover:bg-slate-50/50 transition-colors group'>
                                            <td className='px-6 py-5 flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center text-red-500 shrink-0 group-hover:scale-105 transition-transformer'>
                                                    <FaFilePdf size={20}/>
                                                </div>
                                                <div>
                                                    <p className='font-semibold text-slate-800 text-base'>{record.fileName || "Document"}</p>
                                                    <p className='text-sm text-gray-400 font-medium '>Digital PDF</p>
                                                </div>
                                            </td>
                                            <td className='px-6 py-5'>
                                                <p className='font-medium text-slate-700 text-base'>{record.doctorId?.fullname  || "N/A"}</p>
                                            </td>
                                            <td className='px-6 py-5'>
                                                <p className='text-gray-600 font-medium text-base'>
                                                 {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : "N/A"}                                              
                                                </p>
                                            </td>
                                            <td className='px-6 py-5'>
                                                <div className='flex items-center justify-center gap-3'>
                                                    <button onClick={()=>{
                                                      const url = record.medicalrecord ? record.medicalrecord.trim() : "";
                                                      console.log("Button clicked. URL:", url);
                                                       handleviewpdf(url);
                                                    }} className='flex items-center gap-2 border border-slate-200 text-slate-700 hover:text-[#26a69a] hover:border-[#26a69a] px-4 py-2 rounded-lg font-medium text-lg transition-all shadow-sm bg-white hover:bg-teal-50/20' title='open document in new tab'>
                                                        <LuEye size={16}/>
                                                        <span>View</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => downloadImage(record.medicalrecord, record.fileName)}
                                                        className='flex items-center justify-center w-9 h-9 border border-slate-200 rounded-lg text-slate-600 hover:bg-[#26a69a] hover:text-white hover:border-[#26a69a] transition-all shadow-sm' 
                                                        title='Download file'>
                                                        <LuDownload size={16}/>
                                                   </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                )}
            </div>
          {selectedImage && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
                    <div className="relative bg-white p-2 rounded-lg max-w-3xl w-full">
                        <button className="absolute -top-10 right-0 text-white font-bold" onClick={() => setSelectedImage(null)}>
                            Close
                        </button>
                        <img src={selectedImage} alt="Prescription" className="w-full h-auto object-contain"
                            onError={() => alert("The image failed to load. The URL might be broken.")}></img>
                    </div>
                </div>
           )}
            </div>
  )
}

export default Medicalrecords
