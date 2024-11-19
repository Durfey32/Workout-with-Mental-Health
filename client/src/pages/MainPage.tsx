import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


const MainPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                navigate('/');
            } else {
                setError('Invalid username or password');
                }
            } catch (error) {
                console.log('Error logging in', error);
                setError('Something went wrong');
        }
    };

    return (
        <div>
            <header>
                <h1>Welcome Page</h1>
            </header>

            <main>
                <section>
                    <h2>Quote of the Day</h2>
                    <p>{quote}</p>
                    <p>{quoteAuthor}</p>
                </section>
                <section>
                    <h2>Login</h2>
                    {error && <p>{error}</p>}
                    <form onSubmit={handleSubmit}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="username"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                        required
                        />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        />

                    <button type="submit">Login</button>
                    </form>
                    <p>Don't have an account? <Link to="/create-account">Create one</Link></p>
                </section>
            </main>
        </div>
    );
}

export default MainPage;
