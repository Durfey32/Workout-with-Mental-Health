import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

const Home: React.FC = () => {
const [quote, setQuote] = useState<string | null>(null);
const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);

useEffect(() => {

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

  fetchQuote();
})

  return (
    <div className="dashboard">
      <h1>DASHBOARD</h1>
      <p>{quote}</p>
      <p>{quoteAuthor}</p>
      <Navbar />
      <h2>Welcome to Your Fitness & Mental Health Dashboard</h2>
      <p>Track your progress, access workouts, and Journal!</p>
    </div>
  );
};

export default Home;