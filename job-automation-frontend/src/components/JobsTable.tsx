import { memo } from 'react';
import { type Job } from '../types';
import { api } from '../services/api';

interface JobsTableProps {
  jobs: Job[];
  onJobApplied: () => void;
}

export const JobsTable = memo(({ jobs, onJobApplied }: JobsTableProps) => {
  if (jobs.length === 0) {
    return <p style={styles.empty}>No jobs found. Fetch jobs to see results.</p>;
  }

  const handleLinkClick = async (jobId: number) => {
    try {
      await api.markApplied({ job_id: jobId, user_id: 1 });
      onJobApplied();
    } catch (error) {
      console.error('Failed to mark as applied:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2>Jobs ({jobs.length})</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Title</th>
              <th style={styles.th}>Company</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Salary</th>
              <th style={styles.th}>Posted</th>
              <th style={styles.th}>Link</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <JobRow key={job.id} job={job} onLinkClick={handleLinkClick} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const JobRow = memo(({ job, onLinkClick }: { job: Job; onLinkClick: (id: number) => void }) => (
  <tr style={styles.tr}>
    <td style={styles.td}>{job.id}</td>
    <td style={styles.td}>{job.title}</td>
    <td style={styles.td}>{job.company}</td>
    <td style={styles.td}>{job.location || 'N/A'}</td>
    <td style={styles.td}>{job.salary_range || 'N/A'}</td>
    <td style={styles.td}>
      {job.posted_date ? new Date(job.posted_date).toLocaleDateString() : 'N/A'}
    </td>
    <td style={styles.td}>
      {job.url ? (
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
          onClick={() => onLinkClick(job.id)}
        >
          View & Apply
        </a>
      ) : (
        'N/A'
      )}
    </td>
  </tr>
));

const styles = {
  container: {
    marginBottom: '20px'
  },
  empty: {
    textAlign: 'center' as const,
    color: '#666',
    padding: '40px'
  },
  tableWrapper: {
    overflowX: 'auto' as const,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    fontSize: '14px'
  },
  th: {
    padding: '12px',
    textAlign: 'left' as const,
    backgroundColor: '#f8f9fa',
    borderBottom: '2px solid #dee2e6',
    fontWeight: 'bold' as const,
    color: '#495057'
  },
  tr: {
    borderBottom: '1px solid #dee2e6'
  },
  td: {
    padding: '12px',
    color: '#212529'
  },
  link: {
    color: '#0066cc',
    textDecoration: 'none'
  }
};
