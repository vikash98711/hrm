// src/components/ProtectedRoute.js
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('token'); 
const token = sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/Login" replace />;
  }

  return <Outlet/>;
};

export default ProtectedRoute;
