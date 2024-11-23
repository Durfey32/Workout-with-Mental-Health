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
  const [, setToken] = useState<string | null>(null);

 
  useEffect(() => {

    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
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

  
  const createEntry = async (entryContent: string) => {
    const token = localStorage.getItem('token');

    if (!token) {
      setError('The Token is not getting pulled.');
      return;
    }

    try {
      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
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
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to create entry.');
      }
    } catch (error) {
      setError('An error occurred while creating an entry.');
      console.error(error);
    }
  };

  
  const updateEntry = async (id: string, updatedContent: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Updated Journal Entry', 
          content: updatedContent,
          timestamp: new Date().toISOString(),
          user_id: 'exampleUserId', 
        }),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        setEntries((prevEntries) =>
          prevEntries.map((entry) => (entry._id === id ? updatedEntry : entry))
        );
        setEditMode(null);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update entry.');
      }
    } catch (error) {
      setError('An error occurred while updating an entry.');
      console.error(error);
    }
  };

  const deleteEntry = async (id: string) => {
    try {
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setEntries((prevEntries) => prevEntries.filter((entry) => entry._id !== id));
      } else {
        setError('Failed to delete entry.');
      }
    } catch (error) {
      setError('An error occurred while deleting an entry.');
      console.error(error);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (entry.trim()) {
      await createEntry(entry);
      setEntry(''); 
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
        {error && <p className="error-message">{error}</p>}
        {entries.length > 0 ? (
          <ul>
            {entries.map((entry) => (
              <li key={entry._id} className="journal-entry">
                {editMode === entry._id ? (
                  <>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        updateEntry(entry._id, editContent);
                      }}
                    >
                      Save
                    </button>
                    <button onClick={() => setEditMode(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <h4>{entry.title}</h4>
                    <p>{entry.content}</p>
                    <small>{new Date(entry.timestamp).toLocaleString()}</small>
                    <button
                      onClick={() => {
                        setEditMode(entry._id);
                        setEditContent(entry.content);
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => deleteEntry(entry._id)}>Delete</button>
                  </>
                )}
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