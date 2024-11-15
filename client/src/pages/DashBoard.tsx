
import React from 'react';
import { useState, useEffect, MouseEventHandler } from 'react'
import { Link } from 'react-router-dom'
// import { useAuth0 } from '@auth0/auth0-react'
// import { SignInButton } from '../components/SignInButton'

const DashBoard: React.FC = () => {
  return (
    <div className="dashboard">
      <h2>Welcome to Your Fitness & Mental Health Dashboard</h2>
      <p>Track your progress, access workouts, and Journal!</p>
    </div>
  );
};

export default DashBoard;
