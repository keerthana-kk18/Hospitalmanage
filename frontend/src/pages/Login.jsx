import React, { useState } from 'react'
import { FaRibbon } from 'react-icons/fa6'
import { MdVisibility, MdVisibilityOff, MdArrowBack } from 'react-icons/md'
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import doctor from '../images/doctor3.jpg';

const apiurl=import.meta.env.VITE_BACKEND_URL;


const Login = () => {
    const[email,setemail]=useState('');
    const[password,setpassword]=useState('');
     const [showPassword, setShowPassword] = useState(false);
    const navigate=useNavigate();

    const handlelogin=async(e)=>{
        e.preventDefault();
        try{
            const res=await axios.post(`${apiurl}/api/user/login`,{email,password})
            if(res.status===200){
                localStorage.setItem('token',res.data.token)
                localStorage.setItem('userInfo',JSON.stringify(res.data.user))
                
                const userrole=res.data.user.role;
                if(userrole==='admin'){
                    navigate('/admindashboard');
                }else if(userrole==='doctor'){
                    navigate('/doctordashboard')
                }else{
                    navigate('/userhome')
                }
            }
        }catch(error){
            alert(error.response?.data?.message || 'Login failed. Please try again')
        }
    }
  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-[#26a69a] '>
        <div className='w-full min-h-screen flex flex-col md:flex-row bg-[#26a69a] overflow-hidden relative'>
            <div className='hidden md:block absolute right-0 top-0 bottom-0 h-full w-1/2 bg-[#26a69a]'>
            <div className='w-full h-full bg-slate-900 overflow-hidden relative'>
           <img src={doctor} alt='doctor' className='w-full h-full object-cover opacity-60 grayscale-[30%] brightness-75 contrast-105'></img>
        </div>
        </div>
        <div className=' flex flex-1  items-center justify-center p-6 md:p-12 bg-[#26a69a] relative z-20'>
            <div className='w-full max-w-md bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-100'>
                <div className='flex items-center gap-2 md-8 justify-center'>
                    <FaRibbon size={28} color='#26a69a'/>
                    <span className='text-2xl font-bold text-slate-800'>Medicare</span>
                </div>
                <div className='mb-6 text-center'>
                    <h2 className='text-2xl font-bold text-slate-800'>Welcome Back</h2>
                </div>
                <form className='flex flex-col gap-5' onSubmit={handlelogin}>
                    <div>
                        <label className='block text-lg font-medium text-gray-700 mb-2'>Email Address</label>
                        <input type='email' required value={email} onChange={(e)=> setemail(e.target.value)} placeholder='Enter your email address' className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#26a69a] transition-all text-lg'></input>
                    </div>
                    <div className='relative'>
                        <label className='text-lg font-medium text-gray-700 mb-2'>Password</label>
                        <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e)=> setpassword(e.target.value)} placeholder='Enter your password' className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#26a69a] transition-all text-lg'></input>
                         <button 
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute right-4 top-12 text-gray-400 hover:text-[#26a69a]'>
                            {showPassword ? <MdVisibilityOff size={22} /> : <MdVisibility size={22} />}
                        </button>
                    </div>
                    {/* <input type='password' required value={password} onChange={(e)=> setPassword(e.target.value)} placeholder='Enter your password' className='w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#26a69a] transition-all text-lg'></input> */}
                    <a href='#' className='text-sm text-[#26a69a] font-medium ml-63'>Forgot Password?</a>
                    <button type='submit' className='w-full bg-[#26a69a] text-white font-semibold py-3 rounded-lg hover:bg-[#1f847b] transition-colors shadow-xl mt-2 text-lg'>Login</button>
                </form>
                <div className='text-center mt-6 pt-5 text-sm'>
                    <span className='text-gray-500'>Don't have an account?</span>
                    <Link to='/signup' className='text-[#26a69a] font-semibold'>Create an account</Link>
                </div>
                <div className='mt-2 text-center'>
                    <Link to='/' className='inline-flex items-center gap-2 text-slate-500 hover:text-[#26a69a] font-semibold transition-all'><MdArrowBack size={20} />
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
        <div className='hidden md:block flex-1'></div>
        </div>
    </div>
  )
}

export default Login