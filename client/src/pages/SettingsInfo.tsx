import React from 'react';

const SettingsInfo: React.FC = () => {
  return (
    <div className="settings-info container my-5">
      <h2 className="text-center text-primary mb-4">About & Settings</h2>
      <p className="text-center text-secondary">
        Learn more about the app, adjust privacy settings, and update your preferences.
      </p>

      <div className="row mt-4">
        {/* About the App Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-success">About the App</h5>
              <p className="card-text">
                Our app is designed to help you achieve your fitness and mental health goals through personalized workouts, nutrition tracking, and community support.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Settings Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-warning">Privacy Settings</h5>
              <p className="card-text">
                Manage your privacy settings to control what information is visible to others and how your data is used.
              </p>
              <button className="btn btn-warning btn-sm">Adjust Settings</button>
            </div>
          </div>
        </div>

        {/* User Preferences Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h5 className="card-title text-info">User Preferences</h5>
              <p className="card-text">
                Customize your experience by updating your preferences, including notifications and theme options.
              </p>
              <button className="btn btn-info btn-sm">Update Preferences</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsInfo;
