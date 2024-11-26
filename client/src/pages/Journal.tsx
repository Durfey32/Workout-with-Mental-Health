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
  const [editMode, setEditMode] = useState<string | null>(null); // ID of entry being edited
  const [editContent, setEditContent] = useState<string>(''); // Temporary edited content
  const [error, setError] = useState<string | null>(null); // Error message for user feedback
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Success message

  // Fetch all journal entries on load
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await fetch('/api/journal');
        if (response.ok) {
          const data = await response.json();
          setEntries(data);
        } else {
          setError('Failed to fetch journal entries.');
        }
      } catch (error) {
        setError('An error occurred while fetching entries.');
        console.error(error);
      }
    };

    fetchEntries();
  }, []);

  // Create a new journal entry
  const createEntry = async (entryContent: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authorization token is missing.');
        return;
      }

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: 'Journal Entry',
          content: entryContent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setEntries((prevEntries) => [...prevEntries, newEntry]);
        setSuccessMessage('Entry created successfully!');
        setError(null);
      } else {
        setError('Failed to create entry.');
      }
    } catch (error) {
      setError('An error occurred while creating the entry.');
      console.error(error);
    }
  };

  // Update a journal entry
  const updateEntry = async (id: string, updatedContent: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Updated Journal Entry',
          content: updatedContent,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        setEntries((prevEntries) =>
          prevEntries.map((entry) => (entry._id === id ? updatedEntry : entry))
        );
        setEditMode(null);
        setSuccessMessage('Entry updated successfully!');
        setError(null);
      } else {
        setError('Failed to update entry.');
      }
    } catch (error) {
      setError('An error occurred while updating the entry.');
      console.error(error);
    }
  };

  // Delete a journal entry
  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, { method: 'DELETE' });

      if (response.ok) {
        setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
        setSuccessMessage('Entry deleted successfully!');
        setError(null);
      } else {
        setError('Failed to delete entry.');
      }
    } catch (error) {
      setError('An error occurred while deleting the entry.');
      console.error(error);
    }
  };

  // Handle new entry submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (entry.trim()) {
      await createEntry(entry);
      setEntry('');
    } else {
      setError('Journal entry cannot be empty.');
    }
  };

  return (
    <div className="journal container my-5">
      <Navbar />
      <h2 className="text-center text-primary mb-4">Your Journal</h2>

      {/* Form to Create a New Entry */}
      <div className="card shadow p-4 mb-4">
        <h3 className="text-success">Write a New Entry</h3>
        <form onSubmit={handleSubmit}>
          <textarea
            id="entry"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="Write your thoughts here..."
            className="form-control mb-3"
            rows={5}
            required
          />
          {error && <p className="text-danger">{error}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <button type="submit" className="btn btn-primary w-100">
            Save Entry
          </button>
        </form>
      </div>

      {/* List of Journal Entries */}
      <div className="card shadow p-4">
        <h3 className="text-secondary mb-3">Your Entries</h3>
        {entries.length > 0 ? (
          <ul className="list-group">
            {entries.map((entry) => (
              <li key={entry._id} className="list-group-item">
                {editMode === entry._id ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="form-control mb-2"
                    />
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => updateEntry(entry._id, editContent)}
                    >
                      Save
                    </button>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditMode(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h5>{entry.title}</h5>
                    <p>{entry.content}</p>
                    <small className="text-muted">
                      {new Date(entry.timestamp).toLocaleString()}
                    </small>
                    <div className="mt-2">
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setEditMode(entry._id);
                          setEditContent(entry.content);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteEntry(entry._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No journal entries yet. Start writing!</p>
        )}
      </div>
    </div>
  );
};

export default Journal;
