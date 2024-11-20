import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DashBoard: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true'; // Example of using localStorage for auth

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/dashboard'); 
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
};

export default DashBoard;