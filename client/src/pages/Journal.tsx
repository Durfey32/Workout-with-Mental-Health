import React, { useState } from 'react';

const Journal: React.FC = () => {
  const [entry, setEntry] = useState<string>('');

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle save logic, possibly with local storage or API
  };

  return (
    <div className="journal">
      <h2>Your Journal</h2>
      <form onSubmit={handleSaveEntry}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts here..."
        />
        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
};

export default Journal;
