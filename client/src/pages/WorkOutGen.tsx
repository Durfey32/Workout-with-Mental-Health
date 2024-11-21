import React, { useState } from 'react';
import axios from 'axios';

const WorkoutGen: React.FC = () => {
  const [muscle, setMuscle] = useState<string>('biceps');

  interface Workout {
    name: string;
    type: string;
    equipment?: string;
    instructions: string;
  }

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/workout`, {
        params: { muscle },
      });
      setWorkouts(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch workouts');
      } else {
        setError('Failed to fetch workouts');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="workout-gen container my-5">
      <h2 className="text-center text-primary mb-4">Generate Your Custom Workout</h2>
      <p className="text-center text-secondary">
        Choose a muscle group and we'll generate a workout plan for you!
      </p>

      {/* Input for selecting muscle group */}
      <div className="card shadow p-4 mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchWorkouts();
          }}
        >
          <div className="mb-3">
            <label htmlFor="muscle" className="form-label">
              Muscle Group:
            </label>
            <select
              id="muscle"
              value={muscle}
              onChange={(e) => setMuscle(e.target.value)}
              className="form-select"
            >
              <option value="biceps">Biceps</option>
              <option value="triceps">Triceps</option>
              <option value="chest">Chest</option>
              <option value="back">Back</option>
              <option value="legs">Legs</option>
              <option value="abs">Abs</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Generate Workout
          </button>
        </form>
      </div>

      {/* Display loading spinner */}
      {loading && <p className="text-center text-info">Loading...</p>}

      {/* Display error message */}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Display fetched workouts */}
      <div className="workouts">
        {workouts.length > 0 ? (
          <div className="row">
            {workouts.map((workout, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h5 className="card-title text-success">{workout.name}</h5>
                    <p className="card-text">
                      <strong>Type:</strong> {workout.type}
                    </p>
                    <p className="card-text">
                      <strong>Equipment:</strong> {workout.equipment || 'None'}
                    </p>
                    <p className="card-text">
                      <strong>Instructions:</strong> {workout.instructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-secondary">
              No workouts found for the selected muscle group.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default WorkoutGen;
