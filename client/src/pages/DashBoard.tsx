import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Home: React.FC = () => {
const [quote, setQuote] = useState<string | null>(null);
const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);
const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
const [savedMeals, setSavedMeals] = useState<Meal[]>([]);

interface Workout {
  type: ReactNode;
  _id?: string;
  name: string;
  muscle: string;
  equipment?: string;
}
interface Meal {
  _id: string;
  name: string;
  title: string;
  calories: number;
  protein: string;
  fat: string;
  carbs: string;
  // image: string;
}

const fetchQuote = async () => {
  try {
    const response = await fetch('/quotes');
    if (response.ok) {
      const data = await response.json();
      setQuote(data.quoteText);
      setQuoteAuthor(data.quoteAuthor);
    } else {
      console.error('Failed to fetch quote');
    }
  } catch (error) {
    console.error('Error fetching quote:', error);
  }
  };
  
  
  const fetchSavedWorkout = async () => {
    try {
      const response = await axios.get('/api/workout/saved');
      console.log('Fetched Saved Workouts:', response.data); // Debug log
      setSavedWorkouts(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
      console.error(err.response?.data?.message || 'Failed to fetch saved workouts');
    } else {
      console.error('Failed to fetch saved workouts');
    }
  }
};

const fetchSavedMeals = async () => {
  try {
    const response = await axios.get('/api/meal/saved');
    console.log('Fetched Saved Meals:', response.data); // Debug log
    setSavedMeals(response.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(err.response?.data?.message || 'Failed to fetch saved meals');
    } else {
      console.error('Failed to fetch saved meals');
    }
  }
};

useEffect(() => {
const fetchData = async () => {
  await fetchQuote();
  await fetchSavedWorkout();
  await fetchSavedMeals();
};
fetchData();
  
}, []);


  return (
    <div className="dashboard">
      <h1>HOME</h1>
      <p>{quote}</p>
      <p>{quoteAuthor}</p>
      <Navbar />
      <h2>Welcome to Your Fitness & Mental Health Dashboard</h2>
      <p>Track your progress, access workouts, and Journal!</p>
      <div className="saved-workouts">
        <h3>Saved Workouts</h3>
        {savedWorkouts.length > 0 ? (
          savedWorkouts.map((workout) => (
            <div key={workout._id || workout.name} className="workout">
            <h3>{workout.name}</h3>
            <p><strong>Type:</strong> {workout.type}</p>
            <p><strong>Muscle:</strong> {workout.muscle}</p>
            <p><strong>Equipment:</strong> {workout.equipment || 'None'}</p>
          </div>
          ))
        ) : (
          <p>No saved workouts yet.</p>
        )}
      </div>
      <div className="saved-meals">
  <h3>Saved Meals</h3>
  {savedMeals.length > 0 ? (
    savedMeals.map((meal, index) => (
      <div key={index} className="meal">
        <h4><strong>Meal Title:</strong> {meal.name}</h4>
        <p><strong>Calories:</strong> {meal.calories}</p>
        <p><strong>Protein:</strong> {meal.protein}g</p>
        <p><strong>Fat:</strong> {meal.fat}g</p>
        <p><strong>Carbs:</strong> {meal.carbs}g</p>
      </div>
    ))
  ) : (
    <p>No meals saved yet.</p>
  )}
</div>
      
      </div>
  );
};

export default Home;


