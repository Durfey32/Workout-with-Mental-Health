import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Nutrition: React.FC = () => {
  interface Meal {
    name: string;
    ingredients: string;
    calories: number;
    instructions: string;
  }

  const [meals, setMeals] = useState<Meal[]>([]);
  const [newMeal, setNewMeal] = useState({
    name: '',
    ingredients: '',
    calories: '',
    instructions: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMeals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/meal');
      setMeals(response.data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to fetch meals');
      } else {
        setError('Failed to fetch meals');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/meal', newMeal);
      setMeals((prevMeals) => [...prevMeals, response.data]);
      setNewMeal({ name: '', ingredients: '', calories: '', instructions: '' });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Failed to add meal');
      } else {
        setError('Failed to add meal');
      }
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  return (
    <div className="nutrition container my-5">
      <h2 className="text-center text-primary mb-4">Track Your Nutrition</h2>
      <p className="text-center text-secondary">
        Log your meals, track your macros, and stay on top of your diet!
      </p>

      {/* Add Meal Form */}
      <div className="card shadow p-4 mb-5">
        <h3 className="text-success mb-3">Add a New Meal</h3>
        <form onSubmit={handleAddMeal}>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Meal Name"
              value={newMeal.name}
              onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              placeholder="Ingredients"
              value={newMeal.ingredients}
              onChange={(e) =>
                setNewMeal({ ...newMeal, ingredients: e.target.value })
              }
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              placeholder="Calories"
              value={newMeal.calories}
              onChange={(e) =>
                setNewMeal({ ...newMeal, calories: e.target.value })
              }
              className="form-control"
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              placeholder="Instructions"
              value={newMeal.instructions}
              onChange={(e) =>
                setNewMeal({ ...newMeal, instructions: e.target.value })
              }
              className="form-control"
              rows={3}
              required
            ></textarea>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Meal
          </button>
        </form>
      </div>

      {/* Loading Spinner */}
      {loading && <p className="text-center text-info">Loading...</p>}

      {/* Error Message */}
      {error && <p className="text-center text-danger">{error}</p>}

      {/* Display Fetched Meals */}
      <div className="meals">
        <h3 className="text-primary mb-4">Logged Meals</h3>
        {meals.length > 0 ? (
          <div className="row">
            {meals.map((meal, index) => (
              <div key={index} className="col-md-4 mb-4">
                <div className="card shadow h-100">
                  <div className="card-body">
                    <h5 className="card-title text-success">{meal.name}</h5>
                    <p className="card-text">
                      <strong>Ingredients:</strong> {meal.ingredients}
                    </p>
                    <p className="card-text">
                      <strong>Calories:</strong> {meal.calories}
                    </p>
                    <p className="card-text">
                      <strong>Instructions:</strong> {meal.instructions}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !loading && (
            <p className="text-center text-secondary">
              No meals logged yet. Start tracking now!
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default Nutrition;
