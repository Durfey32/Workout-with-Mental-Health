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

            <main>
                <section>
                    <h2>Quote of the Day</h2>
                    <p>{quote}</p>
                    <p>{quoteAuthor}</p>
                </section>
                    <p>Already have an Account please 
                    <Link to="/login"> <button>Login</button></Link>
                        </p>

                    <p>Don't have an account? <Link to="/create-account"><button>Create one</button></Link></p>
            </main>
        </div>
    );
}

export default MainPage;
