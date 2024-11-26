import React, { ReactNode, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Home: React.FC = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);

  interface Workout {
    type: ReactNode;
    _id?: string;
    name: string;
    muscle: string;
    equipment?: string;
    instructions: string;
  }

  interface Meal {
    _id: string;
    name: string;
    title: string;
    calories: number;
    protein: string;
    fat: string;
    carbs: string;
    image: string;
  }

  interface JournalEntry {
    _id: string;
    title: string;
    content: string;
    timestamp: string;
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
      setSavedMeals(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || 'Failed to fetch saved meals');
      } else {
        console.error('Failed to fetch saved meals');
      }
    }
  };

  const fetchJournalEntries = async () => {
    try {
      const response = await axios.get('/api/journal');
      const data = response.data.sort(
        (a: JournalEntry, b: JournalEntry) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setJournalEntries(data.slice(0, 1)); // Get the most recent entry
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(err.response?.data?.message || 'Failed to fetch journal entries');
      } else {
        console.error('Failed to fetch journal entries');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchQuote();
      await fetchSavedWorkout();
      await fetchSavedMeals();
      await fetchJournalEntries();
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard container my-5">
      <Navbar />
      <h1 className="text-center text-primary mb-4">Fitness & Mental Health Dashboard</h1>
      <div className="row g-4">
        {/* Quotes Section */}
        <div className="col-md-3">
          <div className="card shadow p-3">
            <h4 className="text-success">Quote of the Day</h4>
            <p>{quote ? `"${quote}"` : 'Loading...'}</p>
            <footer className="blockquote-footer">{quoteAuthor || 'Unknown'}</footer>
          </div>
        </div>

        {/* Journal Entries Section */}
        <div className="col-md-3">
          <div className="card shadow p-3">
            <h4 className="text-warning">Journal</h4>
            {journalEntries.length > 0 ? (
              <div>
                <h5>{journalEntries[0].title}</h5>
                <p>{journalEntries[0].content}</p>
                <small className="text-muted">
                  {new Date(journalEntries[0].timestamp).toLocaleString()}
                </small>
              </div>
            ) : (
              <p>No journal entries yet.</p>
            )}
          </div>
        </div>

        {/* Saved Workouts Section */}
        <div className="col-md-3">
          <div className="card shadow p-3">
            <h4 className="text-info">Saved Workouts</h4>
            {savedWorkouts.length > 0 ? (
              savedWorkouts.map((workout) => (
                <div key={workout._id || workout.name} className="mb-2">
                  <h6>{workout.name}</h6>
                  <p>{workout.muscle}</p>
                  <p>{workout.equipment}</p>
                  <p>{workout.instructions}</p>
                  <p>______________________</p>
                </div>
              ))
            ) : (
              <p>No workouts saved yet.</p>
            )}
          </div>
        </div>

        {/* Saved Meals Section */}
        <div className="col-md-3">
          <div className="card shadow p-3">
            <h4 className="text-danger">Saved Meals</h4>
            {savedMeals.length > 0 ? (
              savedMeals.map((meal, index) => (
                <div key={index} className="mb-2">
                  <h6>{meal.name}</h6>
                  <p>Calories: {meal.calories}</p>
                  <p>Protein: {meal.protein}</p>
                  <p>Fat: {meal.fat}</p>
                  <p>Carbs: {meal.carbs}</p>
                  <img src={meal.image} alt={meal.name} className="img-fluid" />
                  <p>______________________</p>
                </div>
              ))
            ) : (
              <p>No meals saved yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
