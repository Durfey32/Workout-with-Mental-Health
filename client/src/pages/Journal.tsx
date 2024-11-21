import React, { useState } from 'react';

const Journal: React.FC = () => {
  const [entry, setEntry] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const maxCharacters = 500; // Limit for journal entry characters

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();

    if (entry.trim().length === 0) {
      setError('Your journal entry cannot be empty.');
      setMessage(null);
      return;
    }

    if (entry.length > maxCharacters) {
      setError(`Your journal entry cannot exceed ${maxCharacters} characters.`);
      setMessage(null);
      return;
    }

    try {
      // Replace this with your API logic for saving the entry
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entry }),
      });

      if (response.ok) {
        setMessage('Your journal entry has been saved successfully.');
        setError(null);
        setEntry(''); // Clear the entry after saving
      } else {
        setError('Failed to save your entry. Please try again.');
        setMessage(null);
      }
    } catch (error) {
      console.error('Error saving journal entry:', error);
      setError('An unexpected error occurred. Please try again later.');
      setMessage(null);
    }
  };

  return (
    <div className="journal container mt-4">
      <h2 className="text-center mb-4">Your Journal</h2>
      <form onSubmit={handleSaveEntry}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          className="form-control mb-3"
          rows={5}
          maxLength={maxCharacters}
        />
        <div className="text-end mb-2">
          <small>
            {entry.length}/{maxCharacters} characters
          </small>
        </div>
        {error && <p className="text-danger">{error}</p>}
        {message && <p className="text-success">{message}</p>}
        <button type="submit" className="btn btn-primary w-100">
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default Journal;
