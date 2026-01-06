import React, { useState } from 'react';

interface LinkedInLoginProps {
  onLogin: (email: string, password: string) => void;
  loading: boolean;
}

export const LinkedInLogin: React.FC<LinkedInLoginProps> = ({ onLogin, loading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="linkedin-login">
      <div className="form-group">
        <label>LinkedIn Email:</label>
        <input
          type="email"
          placeholder="Enter your LinkedIn email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label>LinkedIn Password:</label>
        <input
          type="password"
          placeholder="Enter your LinkedIn password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login to LinkedIn'}
      </button>
    </form>
  );
};