import React, { useState } from 'react';

interface JobSearchFormProps {
  onSearch: (search: string, location: string) => void;
  loading: boolean;
}

export const JobSearchForm: React.FC<JobSearchFormProps> = ({ onSearch, loading }) => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSearch(search.trim(), location.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="job-search-form">
      <div className="search-inputs">
        <input
          type="text"
          placeholder="Job title or keywords"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location (optional)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search Jobs'}
        </button>
      </div>
    </form>
  );
};