import React, { FormEvent, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

interface JournalEntry {
  _id: string;
  title: string;
  content: string;
  timestamp: string;
}

const Journal: React.FC = () => {
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