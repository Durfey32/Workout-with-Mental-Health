import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
            localStorage.setItem('user_id', data.user_id);
            navigate('/home');
        } else {
            setError('Invalid username or password');
            }
        } catch (error) {
            console.log('Error logging in', error);
            setError('Something went wrong');
    }
};

  return (
    <div className="login">
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

      <p>Don't have an account? <Link to="/create-account"><button>Create one here</button></Link></p>
                    </section>
    </div>
  );
};

export default Login;
