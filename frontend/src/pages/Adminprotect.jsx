import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const Adminprotect = () => {
    const user=JSON.parse(localStorage.getItem('userInfo'))
    if(user && user.role==='admin'){
        return <Outlet/>
    }
    return (
        <Navigate to='/login' replace />
    )
  
}

export default Adminprotect