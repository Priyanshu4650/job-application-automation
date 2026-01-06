import React from 'react';
import type { JobListing } from '../types/job';

interface JobListingsProps {
  jobs: JobListing[];
  loading: boolean;
  onSaveJob: (job: JobListing) => void;
}

export const JobListings: React.FC<JobListingsProps> = ({ jobs, loading, onSaveJob }) => {
  if (loading) {
    return <div className="loading">Searching for jobs...</div>;
  }

  if (jobs.length === 0) {
    return <div className="no-jobs">No jobs found. Try a different search.</div>;
  }

  return (
    <div className="job-listings">
      <h3>Found {jobs.length} jobs</h3>
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Job Title</th>
            <th>Company</th>
            <th>Location</th>
            <th>Easy Apply</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job, index) => (
            <tr key={index}>
              <td>{job.title}</td>
              <td>{job.company}</td>
              <td>{job.location}</td>
              <td>{job.isEasyApply ? '✓' : '✗'}</td>
              <td>
                <a href={job.link} target="_blank" rel="noopener noreferrer">
                  View Job
                </a>
                <button onClick={() => onSaveJob(job)}>Save Job</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};