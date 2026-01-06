import React from 'react';
import type { SavedJob } from '../types/job';
import { ApplicationStatus } from '../types/job';

interface SavedJobsTableProps {
  jobs: SavedJob[];
  loading: boolean;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onAutoApply: (id: string) => void;
}

export const SavedJobsTable: React.FC<SavedJobsTableProps> = ({
  jobs,
  loading,
  onUpdateStatus,
  onAutoApply,
}) => {
  if (loading) {
    return <div className="loading">Loading saved jobs...</div>;
  }

  if (jobs.length === 0) {
    return <div className="no-jobs">No saved jobs found.</div>;
  }

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.APPLIED: return '#28a745';
      case ApplicationStatus.INTERVIEW: return '#007bff';
      case ApplicationStatus.REJECTED: return '#dc3545';
      case ApplicationStatus.SAVED: return '#ffc107';
      default: return '#6c757d';
    }
  };

  return (
    <div className="saved-jobs">
      <h3>{jobs.length} Saved Jobs</h3>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Status</th>
            <th>Easy Apply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>
                <select
                  value={job.status}
                  onChange={(e) => onUpdateStatus(job.id, e.target.value as ApplicationStatus)}
                  style={{ color: getStatusColor(job.status) }}
                >
                  <option value={ApplicationStatus.NOT_APPLIED}>Not Applied</option>
                  <option value={ApplicationStatus.SAVED}>Saved</option>
                  <option value={ApplicationStatus.APPLIED}>Applied</option>
                  <option value={ApplicationStatus.INTERVIEW}>Interview</option>
                  <option value={ApplicationStatus.REJECTED}>Rejected</option>
                </select>
              </td>
              <td>{job.isEasyApply ? '✓' : '✗'}</td>
              <td>
                <a href={job.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  View
                </a>
                {job.isEasyApply && job.status !== ApplicationStatus.APPLIED && (
                  <button onClick={() => onAutoApply(job.id)}>Auto Apply</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};