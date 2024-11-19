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
                navigate('/login');
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
        <h1>Create Account</h1>
        <form>
            <label>
            Username:
            <input type="username" name="username" />
            </label>
            <label>
            Password:
            <input type="password" name="password" />
            </label>
            <button type="submit">Create Account</button>
        </form>
        </div>
    );
};

export default CreateAccount;