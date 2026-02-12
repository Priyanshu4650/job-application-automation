import { useState } from 'react';
import { api } from '../services/api';

interface JobFetchFormProps {
  onSuccess: () => void;
}

export const JobFetchForm = ({ onSuccess }: JobFetchFormProps) => {
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [platform, setPlatform] = useState('linkedin');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const result = await api.fetchJobs({ role, location, platform });
      setMessage(result.message);
      onSuccess();
    } catch (error) {
      setMessage('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Fetch Jobs</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Role (e.g., Software Engineer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="text"
          placeholder="Location (e.g., San Francisco)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          style={styles.input}
        />
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          style={styles.input}
        >
          <option value="linkedin">LinkedIn</option>
          <option value="naukri">Naukri</option>
          <option value="glassdoor">Glassdoor</option>
          <option value="indeed">Indeed</option>
        </select>
        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Fetching...' : 'Fetch Jobs'}
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px'
  },
  form: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap' as const
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    flex: '1',
    minWidth: '200px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  message: {
    marginTop: '10px',
    color: '#0066cc',
    fontWeight: 'bold' as const
  }
};
