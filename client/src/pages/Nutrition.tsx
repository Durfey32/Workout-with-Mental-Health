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

  const generateMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/meal', { params: filters });
      setGeneratedMeals(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to generate meals');
      } else {
        setError('Failed to generate meals');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedMeals = async () => {
    try {
      const response = await axios.get('/api/meal/saved');
      setSavedMeals(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch saved meals');
      } else {
        setError('Failed to fetch saved meals');
      }
    }
  };

  const saveMeal = async (meal: Meal) => {
    try {
      const sanitizedMeal = {
        name: meal.title,
        calories: parseInt(meal.calories.toString()),
        protein: parseInt(meal.protein.toString()),
        fat: parseInt(meal.fat.toString()),
        carbs: parseInt(meal.carbs.toString()),
        image: meal.image,
      };

      const response = await axios.post('/api/meal', sanitizedMeal);
      setSavedMeals((prev) => [...prev, response.data]);
    } catch (err) {
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
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to remove meal');
      } else {
        setError('Failed to remove meal');
      }
    }
  };

  useEffect(() => {
    fetchSavedMeals();
  }, []);

  return (
    <div className="nutrition container my-5">
      <Navbar />
      <h2 className="text-center text-primary mb-4">Track Your Nutrition</h2>
      <p className="text-center text-secondary">
        Log your meals, track your macros, and stay on top of your diet!
      </p>

      {/* Filters Section */}
      <div className="card shadow p-4 mb-5">
        <h3 className="text-success mb-4">Filter Meal Options</h3>
        <div className="row g-3">
          <div className="col-md-3">
            <label htmlFor="calories" className="form-label">
              Calories:
            </label>
            <select
              id="calories"
              className="form-select"
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
          </div>

          <div className="col-md-3">
            <label htmlFor="protein" className="form-label">
              Protein (g):
            </label>
            <select
              id="protein"
              className="form-select"
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
          </div>

          <div className="col-md-3">
            <label htmlFor="fat" className="form-label">
              Fat (g):
            </label>
            <select
              id="fat"
              className="form-select"
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
          </div>

          <div className="col-md-3">
            <label htmlFor="carbs" className="form-label">
              Carbs (g):
            </label>
            <select
              id="carbs"
              className="form-select"
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
          </div>
        </div>
        <button className="btn btn-primary mt-4 w-100" onClick={generateMeals}>
          Generate Meal Options
        </button>
      </div>

      {/* Display Loading or Error */}
      {loading && <p className="text-center text-info">Loading...</p>}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Generated Meals */}
      <div className="generated-meals">
        <h3 className="text-primary mb-4">Generated Meals</h3>
        <div className="row g-3">
          {generatedMeals.map((meal, index) => (
            <div key={index} className="col-md-4">
              <div className="card shadow-sm h-100">
                <img
                  src={meal.image}
                  alt={meal.title}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{meal.title}</h5>
                  <p className="card-text">Calories: {meal.calories}</p>
                  <p className="card-text">Protein: {meal.protein}g</p>
                  <p className="card-text">Fat: {meal.fat}g</p>
                  <p className="card-text">Carbs: {meal.carbs}g</p>
                  <button
                    className="btn btn-outline-success w-100"
                    onClick={() => saveMeal(meal)}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Saved Meals */}
      <div className="saved-meals mt-5">
        <h3 className="text-secondary mb-4">Saved Meals</h3>
        <div className="row g-3">
          {savedMeals.map((meal, index) => (
            <div key={index} className="col-md-4">
              <div className="card shadow-sm h-100">
                <img
                  src={meal.image}
                  alt={meal.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{meal.name}</h5>
                  <p className="card-text">Calories: {meal.calories}</p>
                  <p className="card-text">Protein: {meal.protein}g</p>
                  <p className="card-text">Fat: {meal.fat}g</p>
                  <p className="card-text">Carbs: {meal.carbs}g</p>
                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => removeMeal(meal._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Nutrition;