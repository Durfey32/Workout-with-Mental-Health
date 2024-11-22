import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const SettingsInfo: React.FC = () => {
  return (
    <div className="settings-info container my-5">
      <Navbar />
      <div className="card shadow p-4">
        <h2 className="text-center text-primary mb-4">About & Settings</h2>
        <p className="text-secondary text-center">
          Learn more about the app, adjust your privacy settings, and update user preferences.
        </p>

        <div className="mt-4">
          <h5 className="text-success">About the App</h5>
          <p>
            This app is designed to help you achieve your fitness and mental health goals by providing
            personalized workouts, nutrition tracking, and journaling features. Stay motivated and track your progress easily!
          </p>
        </div>

        <div className="mt-4">
          <h5 className="text-warning">Privacy Settings</h5>
          <p>
            Manage your privacy preferences to control what information is visible to others. Keep your journal entries and personal data secure.
          </p>
        </div>

        <div className="mt-4">
          <h5 className="text-info">User Preferences</h5>
          <p>
            Customize your experience by adjusting notification settings, themes, and other preferences.
          </p>
        </div>

        <div className="text-center mt-5">
          <Link to="/">
            <button className="btn btn-danger">Logout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SettingsInfo;
