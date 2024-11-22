import React, { FormEvent, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  timestamp: string;
}

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
  const [entry, setEntry] = useState<string>(''); // Current entry content
  const [entries, setEntries] = useState<JournalEntry[]>([]); // All journal entries

  // Fetch all journal entries from the backend
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/journal');
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        } else {
          console.error('Failed to fetch journal entries');
        }
      } catch (error) {
        console.error('An error occurred while fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  // Create a new journal entry
  const createEntry = async (entryContent: string) => {
    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Journal Entry', // Default title
          content: entryContent, // Entry content
          timestamp: new Date().toISOString(), // Current timestamp
        }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries((prevEntries) => [...prevEntries, newEntry]);
      } else {
        console.error('Failed to create entry');
      }
    } catch (error) {
      console.error('An error occurred while creating an entry:', error);
    }
  };

  // Delete an existing journal entry
  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
      } else {
        console.error('Failed to delete entry');
      }
    } catch (error) {
      console.error('An error occurred while deleting an entry:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (entry.trim()) {
      await createEntry(entry);
      setEntry(''); // Clear the textarea after submission
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
    <div className="journal">
      <Navbar />
      <section>
        <h2>Journal</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="entry">Write your journal entry:</label>
          <textarea
            id="entry"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
      </section>

      <section>
        <h3>Your Journal Entries</h3>
        {entries.length > 0 ? (
          <ul>
            {entries.map((entry) => (
              <li key={entry._id} className="journal-entry">
                <h4>{entry.title}</h4>
                <p>{entry.content}</p>
                <small>{new Date(entry.timestamp).toLocaleString()}</small>
                <button onClick={() => deleteEntry(entry._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No journal entries yet. Start writing!</p>
        )}
      </section>
    </div>
  );
};

export default Journal;
