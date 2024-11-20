import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Nutrition: React.FC = () => {
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

  const [generatedMeals, setGeneratedMeals] = useState<Meal[]>([]);
  const [savedMeals, setSavedMeals] = useState<Meal[]>([]); 
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    calories: '500', 
    protein: '',
    fat: '',
    carbs: '',
  });

  // Generate meal options with filters
  const generateMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/meal', {
        params: filters, 
      });
      setGeneratedMeals(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to generate meals');
      } else {
        setError('Failed to generate meals');
      }
    } finally {
      setLoading(false);
    }
  };

    // Fetch saved meals from the backend
    const fetchSavedMeals = async () => {
      try {
        const response = await axios.get('/api/meal/saved');
        console.log('Saved Meals:', response.data); 
        setSavedMeals(response.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to fetch saved meals');
        } else {
          setError('Failed to fetch saved meals');
        }
      }
    };
    

// Save a meal to the saved meals section and persist it in the backend
const saveMeal = async (meal: Meal) => {
  try {
    // Sanitize numeric fields
    const sanitizedMeal = {
      name: meal.title,
      type: "Generated",
      calories: parseInt(meal.calories.toString().replace(/[^\d]/g, '')) || 0,
      protein: parseInt(meal.protein.toString().replace(/[^\d]/g, '')) || 0,
      carbs: parseInt(meal.carbs.toString().replace(/[^\d]/g, '')) || 0,
      fat: parseInt(meal.fat.toString().replace(/[^\d]/g, '')) || 0,
      image: meal.image,
    };

    const response = await axios.post('/api/meal', sanitizedMeal);
    setSavedMeals((prev) => [...prev, response.data]);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'Failed to save meal');
    } else {
      setError('Failed to save meal');
    }
  }
};

const removeMeal = async (id: string) => {
  try {
    await axios.delete(`/api/meal/${id}`);
    setSavedMeals((prev) => prev.filter((meal) => meal._id !== id));
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      setError(err.response?.data?.message || 'Failed to remove meal');
    } else {
      setError('Failed to remove meal');
    }
  }
};


useEffect(() => {
  fetchSavedMeals(); // Fetch saved meals on component mount
}, []);

  return (
    <div className="nutrition">
      <Navbar />
      <h2>Track Your Nutrition</h2>
      <p>Log your meals, track your macros, and stay on top of your diet!</p>

      {/* Filters */}
      <div className="filters">
        <h3>Filter Meal Options</h3>
        <label htmlFor="calories">Calories:</label>
        <select
          id="calories"
          value={filters.calories}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, calories: e.target.value }))
          }
        >
          <option value="500">Under 500</option>
          <option value="100">Under 100</option>
          <option value="200">Under 200</option>
          <option value="300">Under 300</option>
          <option value="400">Under 400</option>
        </select>

        <label htmlFor="protein">Protein (g):</label>
        <select
          id="protein"
          value={filters.protein}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, protein: e.target.value }))
          }
        >
          <option value="">Any</option>
          <option value="10">Over 10</option>
          <option value="20">Over 20</option>
          <option value="30">Over 30</option>
          <option value="40">Over 40</option>
          <option value="50">Over 50</option>
        </select>

        <label htmlFor="fat">Fat (g):</label>
        <select
          id="fat"
          value={filters.fat}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, fat: e.target.value }))
          }
        >
          <option value="">Any</option>
          <option value="5">Under 5</option>
          <option value="10">Under 10</option>
          <option value="15">Under 15</option>
          <option value="20">Under 20</option>
          <option value="25">Under 25</option>
        </select>

        <label htmlFor="carbs">Carbs (g):</label>
        <select
          id="carbs"
          value={filters.carbs}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, carbs: e.target.value }))
          }
        >
          <option value="">Any</option>
          <option value="20">Under 20</option>
          <option value="40">Under 40</option>
          <option value="60">Under 60</option>
          <option value="80">Under 80</option>
          <option value="100">Under 100</option>
        </select>

        <button onClick={generateMeals}>Generate Meal Options</button>
      </div>

      {/* Display loading spinner */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      {/* Display generated meals */}
      <div className="generated-meals">
        <h3>Generated Meals</h3>
        {generatedMeals.length > 0 ? (
          generatedMeals.map((meal, index) => (
            <div key={index} className="meal">
              <h4><strong>Meal Title:</strong> {meal.title}</h4>
              <p><strong>Calories:</strong> {meal.calories}</p>
              <p><strong>Protein:</strong> {meal.protein}g</p>
              <p><strong>Fat:</strong> {meal.fat}g</p>
              <p><strong>Carbs:</strong> {meal.carbs}g</p>
              {meal.image && <img src={meal.image} alt={meal.title} />}
              <button onClick={() => saveMeal(meal)}>Save</button>
            </div>
          ))
        ) : (
          !loading && <p>No meals generated yet.</p>
        )}
      </div>

      {/* Display saved meals */}
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
        {meal.image && <img src={meal.image} alt={meal.name} />}
        <button onClick={() => removeMeal(meal._id)}>Remove</button>
      </div>
    ))
  ) : (
    <p>No meals saved yet.</p>
  )}
</div>
    </div>
  );
};

export default Nutrition;
