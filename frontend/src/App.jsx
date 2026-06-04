import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Userhome from './pages/Userhome'
import Booking from './pages/Booking'
import Appointments from './pages/Appointments'
import Profile from './pages/Profile'
import Doctordashboard from './pages/Doctordashboard'
import Medicalrecords from './pages/Medicalrecords'
import Doctorappointments from './pages/Doctorappointments'
import Schedandavailability from './pages/schedandavailability'
import Doctorprofile from './pages/Doctorprofile'
import Admindashboard from './pages/Admindashboard'
import Managedoctor from './pages/Managedoctor'
import Adddoctor from './pages/Adddoctor'
import Doctorview from './pages/Doctorview'
import Doctoredit from './pages/Doctoredit'
import Adminprotect from './pages/Adminprotect'
import Allpatients from './pages/Allpatients'

function App() {
  

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/login' element={<Login/>}></Route>
      <Route path='/signup' element={<Signup/>}></Route>

      <Route path='/userhome' element={<Userhome/>}></Route>
      <Route path='/booking/:doctorId?' element={<Booking/>}></Route>
      <Route path='/appointments' element={<Appointments/>}></Route>
      <Route path='/profile' element={<Profile/>}></Route>
      <Route path='/medicalrecords' element={<Medicalrecords/>}></Route>

      <Route path='/doctordashboard' element={<Doctordashboard/>}></Route>
      <Route path='/doctorappointments' element={<Doctorappointments/>}></Route>
      <Route path='/schedandavailability' element={<Schedandavailability/>}></Route>
      <Route path='/doctorprofile' element={<Doctorprofile/>}></Route>

      <Route element={<Adminprotect/>}>
      <Route path='/admindashboard' element={<Admindashboard/>}></Route>
      <Route path='/managedoctor' element={<Managedoctor/>}></Route>
      <Route path='/adddoctor' element={<Adddoctor/>}></Route>
      <Route path='/doctorview' element={<Doctorview/>}></Route>
      <Route path='/doctoredit' element={<Doctoredit/>}></Route> 
      <Route path='/allpatients' element={<Allpatients/>}></Route> 

      </Route>



      






      


      








    </Routes>
    </BrowserRouter>
  )
}

export default App
