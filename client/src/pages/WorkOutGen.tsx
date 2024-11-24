import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const WorkoutGen: React.FC = () => {
  const [muscle, setMuscle] = useState<string>('biceps');
  const [type, setType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  interface Workout {
    _id?: string;
    name: string;
    type: string;
    muscle: string;
    equipment?: string;
    difficulty: string;
    instructions: string;
  }

  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch workouts based on parameters
  const fetchWorkouts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/workout`, {
        params: { muscle, type, difficulty },
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

  // Fetch saved workouts
  const fetchSavedWorkouts = async () => {
    try {
      const response = await axios.get('/api/workout/saved');
      setSavedWorkouts(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch saved workouts');
      } else {
        setError('Failed to fetch saved workouts');
      }
    }
  };

  // Save a workout
  const saveWorkout = async (workout: Workout) => {
    try {
      const response = await axios.post('/api/workout', workout);
      setSavedWorkouts((prev) => [...prev, response.data]);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to save workout');
      } else {
        setError('Failed to save workout');
      }
    }
  };

  // Delete a saved workout
  const deleteWorkout = async (id: string) => {
    try {
      await axios.delete(`/api/workout/${id}`);
      setSavedWorkouts((prev) => prev.filter((workout) => workout._id !== id));
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to remove workout');
      } else {
        setError('Failed to remove workout');
      }
    }
  };

  useEffect(() => {
    fetchSavedWorkouts();
  }, []);

  return (
    <div className="workout-gen container my-5">
      <Navbar />
      <h2 className="text-center text-primary mb-4">Generate Your Custom Workout</h2>
      <p className="text-center text-secondary">
        Select parameters to generate a workout list tailored to your needs!
      </p>

      <div className="card shadow p-4 mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchWorkouts();
          }}
        >
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="muscle" className="form-label">Muscle Group:</label>
              <select id="muscle" className="form-select" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
          <option value="biceps">Biceps</option>
          <option value="triceps">Triceps</option>
          <option value="chest">Chest</option>
          <option value="forearms">Forearms</option>
          <option value="lower_back">Lower Back</option>
          <option value="middle_back">Middle Back</option>
          <option value="abdominals">Abdominals</option>
          <option value="abductors">Abductors</option>
          <option value="adductors">Adductors</option>
          <option value="quadriceps">Quadriceps</option>
          <option value="hamstrings">Hamstrings</option>
          <option value="glutes">Glutes</option>
          <option value="calves">Calves</option>
          <option value="lats">Lats</option>
          <option value="neck">Neck</option>
          <option value="traps">Traps</option>
          <option value="any">Any</option>
                {/* Add more options */}
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="type" className="form-label">Exercise Type:</label>
              <select id="type" className="form-select" value={type || ''} onChange={(e) => setType(e.target.value || null)}>
          <option value="">Any</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="stretching">Stretching</option>
          <option value="strongman">strongman</option>
          <option value="plyometric">Plyometric</option>
          <option value="powerlifting">Power Lifting</option>
          <option value="olympic_weightlifting">Olympic</option>
              </select>
            </div>

            <div className="col-md-4">
              <label htmlFor="difficulty" className="form-label">Difficulty Level:</label>
              <select id="difficulty" className="form-select" value={difficulty || ''} onChange={(e) => setDifficulty(e.target.value || null)}>
                <option value="">Any</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn btn-primary mt-3 w-100">Generate Workout</button>
        </form>
      </div>

      {loading && <p className="text-center text-info">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      <div className="workouts">
        <h3 className="text-primary mb-4">Generated Workouts</h3>
        <div className="row g-3">
          {workouts.map((workout) => (
            <div key={workout.name} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-success">{workout.name}</h5>
                  <p className="card-text"><strong>Type:</strong> {workout.type}</p>
                  <p className="card-text"><strong>Muscle:</strong> {workout.muscle}</p>
                  <p className="card-text"><strong>Difficulty:</strong> {workout.difficulty}</p>
                  <p className="card-text"><strong>Instructions:</strong> {workout.instructions}</p>
                  <button className="btn btn-outline-success w-100" onClick={() => saveWorkout(workout)}>Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="saved-workouts mt-5">
        <h3 className="text-secondary mb-4">Saved Workouts</h3>
        <div className="row g-3">
          {savedWorkouts.map((workout) => (
            <div key={workout._id || workout.name} className="col-md-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title text-info">{workout.name}</h5>
                  <p className="card-text"><strong>Type:</strong> {workout.type}</p>
                  <p className="card-text"><strong>Muscle:</strong> {workout.muscle}</p>
                  <p className="card-text"><strong>Difficulty:</strong> {workout.difficulty}</p>
                  <p className="card-text"><strong>Instructions:</strong> {workout.instructions}</p>
                  <button className="btn btn-outline-danger w-100" onClick={() => deleteWorkout(workout._id!)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutGen;
