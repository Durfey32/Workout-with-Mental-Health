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
    <div className="main-page">
      <header className="text-center py-4 bg-light">
        <h1>Welcome to Our Fitness & Mental Health Platform</h1>
      </header>

      <main className="container text-center py-5">
        {/* Quote Section */}
        <section className="mb-4">
          <h2 className="mb-3">Quote of the Day</h2>
          {quote ? (
            <blockquote className="blockquote">
              <p className="mb-2">"{quote}"</p>
              <footer className="blockquote-footer">{quoteAuthor || 'Unknown'}</footer>
            </blockquote>
          ) : (
            <p>Loading quote...</p>
          )}
        </section>

        {/* Login/Account Links */}
        <section>
          <p>
            Already have an account?{' '}
            <Link to="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
          </p>
          <p>
            Don't have an account?{' '}
            <Link to="/create-account">
              <button className="btn btn-success">Create One</button>
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
