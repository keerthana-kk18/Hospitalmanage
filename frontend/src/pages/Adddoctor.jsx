import React, {useState} from 'react'
import { MdAdd, MdCloudUpload } from 'react-icons/md'
import axios from 'axios';

const apiurl=import.meta.env.VITE_BACKEND_URL;


const Adddoctor = () => {
    const[formdata,setformdata]=useState({
        fullname:'',
        specialization:'',
        experience:'',
        qualification:'',
        consultationfee:'',
        email:'',
        password:''
    })
    const[image,setimage]=useState(null)
    const[loading,setloading]=useState(false)

    const handlechange=(e)=>{
        const{name,value}=e.target
        setformdata((prev)=>({...prev,[name]:value}))
    }
    const handleimagechange=(e)=>{
        if(e.target.files && e.target.files[0]){
            setimage(e.target.files[0])
        }
        }
        const handlesubmit=async(e)=>{
            e.preventDefault();
            if(!image){
                alert('Please upload a profile image');
                return;
            }
            setloading(true);
            try{
                const data=new FormData();
                data.append('fullname',formdata.fullname)
                data.append('specialization',formdata.specialization)
                data.append('experience',formdata.experience)
                data.append('qualification',formdata.qualification)
                data.append('consultationfee',formdata.consultationfee)
                data.append('email',formdata.email)
                data.append('password',formdata.password)
                data.append('image',image)

                const token=localStorage.getItem('token')
                const response=await axios.post(`${apiurl}/api/admin/adddoctor`,data,{
                    headers:{'Content-Type':'multipart/form-data', 'Authorization': `Bearer ${token}`} 
                })
                alert(response.data.message || "Doctor added successfully")
                setformdata({
                    fullname:'',
                    specialization:'',
                    experience:'',
                    qualification:'',
                    consultationfee:'',
                    email:'',
                    password:''
                })
                setimage(null)
            }catch(error){
                console.error("Add doctor failed:",error)
                const errormsg=error.response?.data?.message || 'Failed to add doctor. Please try again.'
                alert(errormsg)
            }finally{
                setloading(false)
           }
        }
  return (
    <div className='w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 p-6 md:p-10'>
        <form onSubmit={handlesubmit} className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
                <span className='text-slate-700 font-bold text-lg tracking-wide'>Upload Profile Image</span>
                <div className='flex items-center gap-3'>
                    <label className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-[#26a69a]/20 text-[#26a69a] font-bold text-lg rounded-full cursor-pointer hover:bg-[#26a69a]/5 transition-colors shadow-sm'>
                    <MdCloudUpload size={20}/>
                    <span> Upload Image</span>
                    <input type='file' accept='image/*' onChange={handleimagechange} className='hidden'></input>
                    </label>
                    <span className='text-gray-400 text-lg font-semibold max-w-xs'>{image? image.name:'No image selected'}</span>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 mt-2'>
                <div className='w-full'>
                    <input type='text' name='fullname' placeholder='Full Name' value={formdata.fullname} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
                <div className='w-full'>
                    <input type='text' name='specialization' placeholder='Specialization' value={formdata.specialization} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
                <div className='w-full'>
                    <input type='number' name='experience' placeholder='Year of Experience' value={formdata.experience} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
                <div className='w-full'>
                    <input type='text' name='qualification' placeholder='Qualification' value={formdata.qualification} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
                <div className='w-full'>
                    <input type='number' name='consultationfee' placeholder='Consultation Fee' value={formdata.consultationfee} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
                
                <div className='w-full'>
                    <input type='email' name='email' placeholder='Email' value={formdata.email} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
                
                <div className='w-full'>
                    <input type='password' name='password' placeholder='Password' value={formdata.password} onChange={handlechange} className='w-full border-2 border-[#26a69a]/10 rounded-full px-6 py-4 text-slate-700 font-bold text-lg outline-none focus:border-[#26a69a] placeholder-gray-400 bg-white shadow-sm transition-all' required></input>
                </div>
            </div>
            <div className='flex justify-end pt-4 mt-2'>
                <button type='submit' disabled={loading} className='flex items-center justify-center gap-2 px-8 py-4 bg-[#26a69a] text-white font-bold text-lg rounded-xl hover:bg-[#26a69a] transition-all shadow-teal-600/10 w-full md:w-auto'>
                    {loading? 'Adding Doctor...': 'Add Doctor'}
                </button>
            </div>
        </form>
    </div>
  )
}

export default Adddoctor