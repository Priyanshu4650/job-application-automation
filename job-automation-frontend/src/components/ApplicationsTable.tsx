import { memo } from 'react';
import { type Application } from '../types';

interface ApplicationsTableProps {
  applications: Application[];
}

export const ApplicationsTable = memo(({ applications }: ApplicationsTableProps) => {
  if (applications.length === 0) {
    return <p style={styles.empty}>No applications found.</p>;
  }

  return (
    <div style={styles.container}>
      <h2>Applications ({applications.length})</h2>
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Job ID</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Applied At</th>
              <th style={styles.th}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <ApplicationRow key={app.id} application={app} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
});

const ApplicationRow = memo(({ application }: { application: Application }) => (
  <tr style={styles.tr}>
    <td style={styles.td}>{application.id}</td>
    <td style={styles.td}>{application.job_id}</td>
    <td style={styles.td}>
      <span style={getStatusStyle(application.status)}>{application.status}</span>
    </td>
    <td style={styles.td}>{new Date(application.applied_at).toLocaleString()}</td>
    <td style={styles.td}>{application.notes || 'N/A'}</td>
  </tr>
));

const getStatusStyle = (status: string) => ({
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  backgroundColor: status === 'pending' ? '#fff3cd' : '#d1ecf1',
  color: status === 'pending' ? '#856404' : '#0c5460'
});

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
  }
};
