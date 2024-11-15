import React from 'react';
import { useNavigate } from 'react-router-dom';

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginRedirect = () => {
    navigate('/login'); 
  };

  return (
    <div className="main-page">
      <h1>Welcome to Our Fitness & Mental Health Platform</h1>
      <p>Your journey to a healthier life starts here. Log in to access personalized workouts, community support, and more!</p>
      <button onClick={handleLoginRedirect}>Get Started</button>
    </div>
  );
};

export default MainPage;
