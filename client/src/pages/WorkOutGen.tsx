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
      console.log('Fetched Saved Workouts:', response.data); // Debug log
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
      console.log('Saved Workout Response:', response.data);
  
      setSavedWorkouts((prev) => Array.isArray(prev) ? [...prev, response.data] : [response.data]);
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
  console.log('Deleting workout with id:', id); // Debug log
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
    <div>
      <Navbar />
      <div className="workout-gen">
      <h2>Generate Your Custom Workout</h2>
      <p>Select parameters to generate a workout list tailored to your needs!</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWorkouts();
        }}
      >
        <label htmlFor="muscle">Muscle Group:</label>
        <select id="muscle" value={muscle} onChange={(e) => setMuscle(e.target.value)}>
          {/* Add more muscle groups as needed */}
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
        </select>

        <label htmlFor="type">Exercise Type:</label>
        <select id="type" value={type || ''} onChange={(e) => setType(e.target.value || null)}>
          <option value="">Any</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="stretching">Stretching</option>
          <option value="strongman">strongman</option>
          <option value="plyometric">Plyometric</option>
          <option value="powerlifting">Power Lifting</option>
          <option value="olympic_weightlifting">Olympic</option>
        </select>

        <label htmlFor="difficulty">Difficulty Level:</label>
        <select id="difficulty" value={difficulty || ''} onChange={(e) => setDifficulty(e.target.value || null)}>
          <option value="">Any</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="expert">Expert</option>
        </select>

        <button type="submit">Generate Workout</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <div className="workouts">
        <h3>Generated Workouts</h3>
        {workouts.length > 0 ? (
          workouts.map((workout) => (
            <div key={workout.name} className="workout">
              <h3>{workout.name}</h3>
              <p><strong>Type:</strong> {workout.type}</p>
              <p><strong>Muscle:</strong> {workout.muscle}</p>
              <p><strong>Equipment:</strong> {workout.equipment || 'None'}</p>
              <p><strong>Difficulty:</strong> {workout.difficulty}</p>
              <p><strong>Instructions:</strong> {workout.instructions}</p>
              <button onClick={() => saveWorkout(workout)}>Save</button>
            </div>
          ))
        ) : (
          !loading && <p>No workouts found for the selected criteria.</p>
        )}
      </div>

      <div className="saved-workouts">
        <h3>Saved Workouts</h3>
        {savedWorkouts.length > 0 ? (
          savedWorkouts.map((workout) => (
            <div key={workout._id || workout.name} className="workout">
              <h3>{workout.name}</h3>
              <p><strong>Type:</strong> {workout.type}</p>
              <p><strong>Muscle:</strong> {workout.muscle}</p>
              <p><strong>Equipment:</strong> {workout.equipment || 'None'}</p>
              <p><strong>Difficulty:</strong> {workout.difficulty}</p>
              <p><strong>Instructions:</strong> {workout.instructions}</p>
              <button onClick={() => deleteWorkout(workout._id!)}>Delete</button>
            </div>
          ))
        ) : (
          <p>No saved workouts yet.</p>
        )}
      </div>
    </div>
    </div>
  );
};

export default WorkoutGen;
