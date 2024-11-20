import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

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
    <div className="workout-gen">
      <Navbar />
      <h2>Generate Your Custom Workout</h2>
      <p>Choose a muscle group and we'll generate a workout plan for you!</p>

      {/* Input for selecting muscle group */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWorkouts();
        }}
      >
        <label htmlFor="muscle">Muscle Group:</label>
        <select
          id="muscle"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
        >
          <option value="biceps">Biceps</option>
          <option value="triceps">Triceps</option>
          <option value="chest">Chest</option>
          <option value="back">Back</option>
          <option value="legs">Legs</option>
          <option value="abs">Abs</option>
        </select>
        <button type="submit">Generate Workout</button>
      </form>

      {/* Display loading spinner */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      {/* Display fetched workouts */}
      <div className="workouts">
        {workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <div key={index} className="workout">
              <h3>{workout.name}</h3>
              <p>
                <strong>Type:</strong> {workout.type}
              </p>
              <p>
                <strong>Equipment:</strong> {workout.equipment || 'None'}
              </p>
              <p>
                <strong>Instructions:</strong> {workout.instructions}
              </p>
            </div>
          ))
        ) : (
          !loading && <p>No workouts found for the selected muscle group.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutGen;
