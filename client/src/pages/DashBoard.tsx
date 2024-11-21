import React from 'react';

const DashBoard: React.FC = () => {
  return (
    <div className="dashboard container mt-5">
      <div className="text-center mb-4">
        <h2 className="display-4 text-primary">Welcome to Your Dashboard</h2>
        <p className="lead text-secondary">
          Track your progress, access workouts, and reflect in your journal!
        </p>
      </div>

      <div className="row text-center">
        {/* Workouts Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Workouts</h5>
              <p className="card-text">
                Access your personalized workout plans and track your fitness goals.
              </p>
              <a href="/workout-gen" className="btn btn-outline-success">
                Go to Workouts
              </a>
            </div>
          </div>
        </div>

        {/* Journal Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">Journal</h5>
              <p className="card-text">
                Reflect on your day and log your thoughts in your private journal.
              </p>
              <a href="/journal" className="btn btn-outline-warning">
                Go to Journal
              </a>
            </div>
          </div>
        </div>

        {/* Nutrition Section */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info">Nutrition</h5>
              <p className="card-text">
                View meal plans and track your daily calorie intake.
              </p>
              <a href="/nutrition" className="btn btn-outline-info">
                Go to Nutrition
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
