import { useState, useEffect, useCallback } from 'react';
import { JobFetchForm } from './components/JobFetchForm';
import { JobsTable } from './components/JobsTable';
import { ApplicationsTable } from './components/ApplicationsTable';
import { Pagination } from './components/Pagination';
import { api } from './services/api';
import { type Job, type Application } from './types';

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [loading, setLoading] = useState(false);
  const [jobsPage, setJobsPage] = useState(1);
  const [appsPage, setAppsPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalApps, setTotalApps] = useState(0);
  const itemsPerPage = 20;

  const loadJobs = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const [data, count] = await Promise.all([
        api.getJobs(itemsPerPage, offset),
        api.getJobsCount()
      ]);
      setJobs(data);
      setTotalJobs(count);
    } catch (error) {
      console.error('Error loading jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadApplications = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const offset = (page - 1) * itemsPerPage;
      const [data, count] = await Promise.all([
        api.getApplications(itemsPerPage, offset),
        api.getApplicationsCount()
      ]);
      setApplications(data);
      setTotalApps(count);
    } catch (error) {
      console.error('Error loading applications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadJobs(jobsPage);
  }, [jobsPage, loadJobs]);

  useEffect(() => {
    loadApplications(appsPage);
  }, [appsPage, loadApplications]);

  const handleJobApplied = () => {
    loadApplications(appsPage);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1>Job Application Automation</h1>
      </header>

      <main style={styles.main}>
        <JobFetchForm onSuccess={() => loadJobs(1)} />

        <div style={styles.tabs}>
          <button
            onClick={() => setActiveTab('jobs')}
            style={activeTab === 'jobs' ? styles.activeTab : styles.tab}
          >
            Jobs
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            style={activeTab === 'applications' ? styles.activeTab : styles.tab}
          >
            Applications
          </button>
        </div>

        {loading ? (
          <p style={styles.loading}>Loading...</p>
        ) : (
          <>
            {activeTab === 'jobs' && (
              <>
                <JobsTable jobs={jobs} onJobApplied={handleJobApplied} />
                <Pagination
                  currentPage={jobsPage}
                  totalItems={totalJobs}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setJobsPage}
                />
              </>
            )}
            {activeTab === 'applications' && (
              <>
                <ApplicationsTable applications={applications} />
                <Pagination
                  currentPage={appsPage}
                  totalItems={totalApps}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setAppsPage}
                />
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f0f2f5'
  },
  header: {
    backgroundColor: '#0066cc',
    color: 'white',
    padding: '20px',
    textAlign: 'center' as const,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px'
  },
  tabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  activeTab: {
    padding: '10px 20px',
    backgroundColor: '#0066cc',
    color: 'white',
    border: '1px solid #0066cc',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold' as const
  },
  loading: {
    textAlign: 'center' as const,
    padding: '40px',
    fontSize: '16px',
    color: '#666'
  }
};

export default App;
