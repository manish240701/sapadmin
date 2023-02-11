import React, { useContext, useEffect } from 'react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { Routes, Route, Navigate } from "react-router-dom"
import { AuthContext } from './context/AuthContext'
import Extract from "./pages/Extract";
import SuperAdmin from './components/SuperAdmin'
import CreateUser from './components/CreateUser'
const Router = () => {
  const rollNos=[]
  const {currentUser} = useContext(AuthContext)
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/" />;
  };

  return (
    <div className="router-container">
      <Routes>
        <Route path="/" element={ <Login/> } />
        <Route path="dashboard/extract" element={<RequireAuth><CreateUser/></RequireAuth>}/>
        <Route path="dashboard" element={ <RequireAuth><Dashboard/></RequireAuth> } />
      </Routes>
    </div>
  )
}

export default Router