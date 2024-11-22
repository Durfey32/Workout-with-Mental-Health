import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const SettingsInfo: React.FC = () => {
  return (
    <div className="settings-info">
      <Navbar />
      <h2>About & Settings</h2>
      <p>Learn more about the app, privacy settings, and user preferences.</p>
      <p><Link to="/"><button>Logout</button></Link></p>
    </div>
  );
};

export default SettingsInfo;
