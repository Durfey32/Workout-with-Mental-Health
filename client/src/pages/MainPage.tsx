import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
  const [quote, setQuote] = useState<string | null>(null);
  const [quoteAuthor, setQuoteAuthor] = useState<string | null>(null);

  useEffect(() => {
    // Fetch a random quote from an API
    const fetchQuote = async () => {
      try {
        const response = await fetch('/quotes'); // Replace with actual API endpoint
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
    <div className="main-page container d-flex flex-column align-items-center vh-100">
      <header className="text-center py-4">
        <h1 className="display-4 text-primary">Welcome to Our Fitness & Mental Health Platform</h1>
        <p className="lead text-secondary">
          Your journey to a healthier mind and body starts here!
        </p>
      </header>

      <main className="text-center w-100">
        <section className="mb-5">
          <h2 className="text-success">Quote of the Day</h2>
          {quote ? (
            <blockquote className="blockquote">
              <p className="mb-2">"{quote}"</p>
              <footer className="blockquote-footer">{quoteAuthor || 'Unknown'}</footer>
            </blockquote>
          ) : (
            <p className="text-muted">Loading quote...</p>
          )}
        </section>

        <section>
          <p>
            Already have an account?{' '}
            <Link to="/login" className="btn btn-primary mx-2">
              Login
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link to="/create-account" className="btn btn-success mx-2">
              Create One
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
