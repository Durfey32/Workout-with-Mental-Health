import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);

  useEffect(() => {
    // Fetch a random quote from an API
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
}, []);

  return (
    <div className="main-page">
      <h1>Welcome to Our Fitness & Mental Health Platform</h1>
      <p>Your journey to a healthier life starts here. Log in to access personalized workouts, community support, and more!</p>
      <p>{quote ? `"${quote}" - ${quoteAuthor}` : 'Fetching a motivation quote ...'}</p>
      <Link to="/login"><button>Get Started</button></Link>
    </div>
  );
};

export default MainPage;
