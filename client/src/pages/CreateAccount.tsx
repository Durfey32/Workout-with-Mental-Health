import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const CreateAccount = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/create-account', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password})
            });

            if (response.ok) {
                navigate('/dashboard');
            } else {
                setError('Failed to create account');
            }
        } catch (error) {
            console.log('Error creating account', error);
            setError('Something went wrong');
        }
    };
    return (
        <div>
            <header>
                <h1>Create Account</h1>
            </header>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>
                <button type="submit">Create Account</button>
                {error && <div>{error}</div>}
            </form>
        </div>
    );
};

export default CreateAccount;