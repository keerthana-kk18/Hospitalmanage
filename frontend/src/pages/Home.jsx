import React, { useState } from 'react'
import { FaRibbon } from "react-icons/fa6";
import { MdClose } from "react-icons/md";
import { MdMenu } from "react-icons/md";
import img from '../images/img1.webp';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
    const[open,setopen]=useState(false);
    const location=useLocation();
  return (
    <div className='min-h-screen relative bg-blue'>
        <nav className='flex items-center justify-between h-20 bg-white shadow-2xl px-6 lg:px-20 max-w-7xl mx-auto relative z-50 mt-10 rounded-2xl'>
            <div className='flex items-center gap-2'>
                <FaRibbon size={30} color='#26A69A'/>
                <span className='text-2xl font-bold '>Medicare</span>
            </div>
            <div className='hidden md:flex items-center gap-10'>
                <Link to='/'>
                    <button className={` font-medium text-lg ${location.pathname==='/'?'text-[#26A69A]':'text-black'}`}>Home</button>
                </Link>
                <Link to='/'>
                    <button className={` font-medium text-lg ${location.pathname==='/dashboard'?'text-[#26A69A]':'text-black'}`}>About Us</button>
                </Link>
            </div>
            <div className="hidden md:flex items-center gap-4 ">
                <Link to='/login'>
                <button className='font-semibold text-gray-700 hover:text-[#26a69a] transition-colors border border-gray-500 rounded-lg px-4 py-2'>Login</button>
                </Link>
                <Link to='/signup'>
                <button className='font-semibold text-white bg-[#26a69a] px-4 py-2 rounded-lg hover:bg-[#1f847b] transition-colors'>Signup</button>
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
                <Link to='/' onClick={()=>setopen(false)} className='text-lg font-medium text-slate-800  pb-2'>Home</Link>
                <Link to='/' onClick={()=>setopen(false)} className='text-lg font-medium text-slate-800  pb-2'>About Us</Link>
                <div className='flex flex-col gap-3 pt-2'>
                    <Link to='/login' onClick={()=> setopen(false)} className='text-center font-semibold text-gray-700 py-2 border border-gray-200 rounded-lg'>
                    Login
                    </Link>
                     <Link to='/signup' onClick={()=> setopen(false)} className='text-center font-semibold text-white py-2 bg-[#26a69a] rounded-lg'>
                    Signup
                    </Link>
                </div>
                
                </div>
        )}
        <div className='max-w-7xl mx-auto px-4 mt-6'>
    <div className='w-full h-[350px] md:h-[480px] rounded-2xl shadow-lg relative overflow-hidden'>
        <img src={img} alt='hospital image' className='w-full h-full object-cover'/>
        <div className='absolute inset-0 flex flex-col items-center justify-center p-8 md:p-16 text-center bg-black/30'>
            <div className='max-w-xl text-white'>
                <h1 className='text-3xl md:text-5xl font-extrabold mb-4 drop-shadow-lg'>
                    Your Health, Our Priority, Trusted Care For Every Patient
                </h1>
                <p className='text-sm md:text-lg text-slate-50 mb-6 font-bold drop-shadow-sm'>
                    Manage your clinical appointments, access your personal medical timeline records and connect with specialist doctors seamlessly.
                </p>
                <Link to='/signup'>
                    <button className='bg-white hover:bg-slate-100 text-xl text-[#26a69a] font-bold px-14 py-3 rounded-lg transition-all shadow-md'>
                        Get Started
                    </button>
                </Link>
            </div>
        </div>
    </div>
</div>
<footer className="bg-slate-900 text-slate-300 py-12 px-6 mt-14">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <FaRibbon size={28} color="#26a69a" />
            <span className="text-2xl font-bold text-white">Medicare</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed">
            Providing trusted healthcare services to our community. We prioritize your health and well-being with seamless digital access to specialist care.
          </p>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-[#26a69a] transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-[#26a69a] transition">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-[#26a69a] transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-[#26a69a] transition">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#26a69a] transition">Terms of Service</Link></li>
            <li><Link to="/faq" className="hover:text-[#26a69a] transition">FAQs</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-800 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Medicare. All rights reserved.</p>
      </div>
    </footer>
    </div>
  )}
  

export default Home