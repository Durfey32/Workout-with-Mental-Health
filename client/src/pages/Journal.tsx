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
    <div className="journal container my-5">
      <Navbar />
      <section className="mb-5">
        <h2 className="text-center text-primary mb-4">Journal</h2>
        <form onSubmit={handleSubmit} className="card shadow p-4">
          <div className="mb-3">
            <label htmlFor="entry" className="form-label">
              Write your journal entry:
            </label>
            <textarea
              id="entry"
              className="form-control"
              value={entry}
              onChange={(event) => setEntry(event.target.value)}
              rows={4}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Submit
          </button>
        </form>
      </section>

      <section>
        <h3 className="text-secondary mb-4">Your Journal Entries</h3>
        {entries.length > 0 ? (
          <div className="row g-3">
            {entries.map((entry) => (
              <div key={entry._id} className="col-md-6">
                <div className="card shadow-sm h-100">
                  <div className="card-body">
                    <h4 className="card-title text-info">{entry.title}</h4>
                    <p className="card-text">{entry.content}</p>
                    <small className="text-muted">
                      {new Date(entry.timestamp).toLocaleString()}
                    </small>
                    <button
                      onClick={() => deleteEntry(entry._id)}
                      className="btn btn-outline-danger mt-3 w-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">No journal entries yet. Start writing!</p>
        )}
      </section>
    </div>
  );
};

export default Journal;
