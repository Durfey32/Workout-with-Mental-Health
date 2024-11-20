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
    <div className="nutrition">
      <h2>Track Your Nutrition</h2>
      <p>Log your meals, track your macros, and stay on top of your diet!</p>

      {/* Add Meal Form */}
      <form onSubmit={handleAddMeal}>
        <input
          type="text"
          placeholder="Meal Name"
          value={newMeal.name}
          onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ingredients"
          value={newMeal.ingredients}
          onChange={(e) => setNewMeal({ ...newMeal, ingredients: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Calories"
          value={newMeal.calories}
          onChange={(e) => setNewMeal({ ...newMeal, calories: e.target.value })}
          required
        />
        <textarea
          placeholder="Instructions"
          value={newMeal.instructions}
          onChange={(e) => setNewMeal({ ...newMeal, instructions: e.target.value })}
          required
        ></textarea>
        <button type="submit">Add Meal</button>
      </form>

      {/* Display loading spinner */}
      {loading && <p>Loading...</p>}

      {/* Display error message */}
      {error && <p className="error">{error}</p>}

      {/* Display fetched meals */}
      <div className="meals">
        <h3>Logged Meals</h3>
        {meals.length > 0 ? (
          meals.map((meal, index) => (
            <div key={index} className="meal">
              <h4>{meal.name}</h4>
              <p><strong>Ingredients:</strong> {meal.ingredients}</p>
              <p><strong>Calories:</strong> {meal.calories}</p>
              <p><strong>Instructions:</strong> {meal.instructions}</p>
            </div>
          ))
        ) : (
          !loading && <p>No meals logged yet. Start tracking now!</p>
        )}
      </div>
    </div>
  );
};

export default Nutrition;
