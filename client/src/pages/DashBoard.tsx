<<<<<<< HEAD
const DashBoard = () => {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
=======
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashBoard: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Example of using localStorage for auth

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); 
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; 
  }

  return (
    <div className="dashboard">
      <h2>Welcome to Your Fitness & Mental Health Dashboard</h2>
      <p>Track your progress, access workouts, and Journal!</p>
    </div>
  );
>>>>>>> 9be4df3d02cf10d0c26d98e55135877229029640
};

export default DashBoard;