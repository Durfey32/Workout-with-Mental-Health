import React, { useState } from 'react';
import axios from 'axios';

const WorkoutGen: React.FC = () => {
  const [muscle, setMuscle] = useState<string>('biceps');
  const [type, setType] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);

  interface Workout {
    name: string;
    type: string;
    muscle: string;
    equipment?: string;
    difficulty: string;
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

  return (
    <div className="workout-gen">
      <h2>Generate Your Custom Workout</h2>
      <p>Select parameters to generate a workout list tailored to your needs!</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWorkouts();
        }}
      >
        {/* Muscle Group */}
        <label htmlFor="muscle">Muscle Group:</label>
        <select
          id="muscle"
          value={muscle}
          onChange={(e) => setMuscle(e.target.value)}
        >
          <option value="biceps">Biceps</option>
          <option value="triceps">Triceps</option>
          <option value="chest">Chest</option>
          <option value="lower_back">Lower Back</option>
          <option value="middle_back">Middle Back</option>
          <option value="abdominals">Abdominals</option>
          <option value="quadriceps">Quadriceps</option>
          <option value="hamstrings">Hamstrings</option>
          <option value="glutes">Glutes</option>
        </select>

        {/* Exercise Type */}
        <label htmlFor="type">Exercise Type:</label>
        <select
          id="type"
          value={type || ''}
          onChange={(e) => setType(e.target.value || null)}
        >
          <option value="">Any</option>
          <option value="cardio">Cardio</option>
          <option value="strength">Strength</option>
          <option value="stretching">Stretching</option>
          <option value="plyometrics">Plyometrics</option>
          <option value="powerlifting">Powerlifting</option>
          <option value="olympic_weightlifting">Olympic Weightlifting</option>
          <option value="strongman">Strongman</option>
        </select>

        {/* Difficulty */}
        <label htmlFor="difficulty">Difficulty Level:</label>
        <select
          id="difficulty"
          value={difficulty || ''}
          onChange={(e) => setDifficulty(e.target.value || null)}
        >
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
        {workouts.length > 0 ? (
          workouts.map((workout, index) => (
            <div key={index} className="workout">
              <h3>{workout.name}</h3>
              <p>
                <strong>Type:</strong> {workout.type}
              </p>
              <p>
                <strong>Muscle:</strong> {workout.muscle}
              </p>
              <p>
                <strong>Equipment:</strong> {workout.equipment || 'None'}
              </p>
              <p>
                <strong>Difficulty:</strong> {workout.difficulty}
              </p>
              <p>
                <strong>Instructions:</strong> {workout.instructions}
              </p>
            </div>
          ))
        ) : (
          !loading && <p>No workouts found for the selected criteria.</p>
        )}
      </div>
    </div>
  );
};

export default WorkoutGen;
