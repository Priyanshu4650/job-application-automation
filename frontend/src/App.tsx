import React, { useState, useEffect } from 'react';
import type { Company, CreateCompanyDto } from './types/company';
import type { JobListing, SavedJob, ApplicationStatus } from './types/job';
import { companiesApi, jobsApi } from './services/api';
import { CompanyForm } from './components/CompanyForm';
import { CompaniesTable } from './components/CompaniesTable';
import { JobSearchForm } from './components/JobSearchForm';
import { JobListings } from './components/JobListings';
import { LinkedInLogin } from './components/LinkedInLogin';
import { SavedJobsTable } from './components/SavedJobsTable';
import { Modal } from './components/Modal';
import './App.css';

type Tab = 'companies' | 'jobs' | 'saved-jobs';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('companies');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      const data = await companiesApi.getAll();
      setCompanies(data);
      setError(null);
    } catch (err) {
      setError('Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsApi.getSavedJobs();
      setSavedJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  const searchJobs = async (search: string, location: string) => {
    try {
      setLoading(true);
      const data = await jobsApi.searchLinkedIn(search, location);
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to search jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await jobsApi.login(email, password);
      if (result.success) {
        setIsLoggedIn(true);
        setShowLogin(false);
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await jobsApi.logout();
      setIsLoggedIn(false);
      setError(null);
    } catch (err) {
      setError('Logout failed');
    }
  };

  const handleSaveJob = async (job: JobListing) => {
    try {
      await jobsApi.saveJob({
        title: job.title,
        company: job.company,
        location: job.location,
        linkedinUrl: job.link,
        isEasyApply: job.isEasyApply,
      });
      setError(null);
      if (activeTab === 'saved-jobs') {
        loadSavedJobs();
      }
    } catch (err) {
      setError('Failed to save job');
    }
  };

  const handleUpdateJobStatus = async (id: string, status: ApplicationStatus) => {
    try {
      await jobsApi.updateJobStatus(id, status);
      loadSavedJobs();
    } catch (err) {
      setError('Failed to update job status');
    }
  };

  const handleAutoApply = async (id: string) => {
    if (!isLoggedIn) {
      setError('Please login to LinkedIn first');
      return;
    }
    
    try {
      setLoading(true);
      const result = await jobsApi.autoApply(id);
      if (result.success) {
        loadSavedJobs();
        setError(null);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Auto-apply failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check login status on app load
    const checkLoginStatus = async () => {
      try {
        const status = await jobsApi.getLoginStatus();
        setIsLoggedIn(status.isLoggedIn);
      } catch (err) {
        console.error('Failed to check login status');
      }
    };
    
    checkLoginStatus();
    
    if (activeTab === 'companies') {
      loadCompanies();
    } else if (activeTab === 'saved-jobs') {
      loadSavedJobs();
    }
  }, [activeTab]);

  const handleCreate = async (data: CreateCompanyDto) => {
    try {
      setLoading(true);
      await companiesApi.create(data);
      setShowAddForm(false);
      loadCompanies();
    } catch (err) {
      setError('Failed to create company');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: CreateCompanyDto) => {
    if (!editingCompany) return;
    try {
      setLoading(true);
      await companiesApi.update(editingCompany.id, data);
      setEditingCompany(null);
      loadCompanies();
    } catch (err) {
      setError('Failed to update company');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to disable this company?')) return;
    try {
      setLoading(true);
      await companiesApi.delete(id);
      loadCompanies();
    } catch (err) {
      setError('Failed to disable company');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Job Application Automation</h1>
        <div className="header-actions">
          <nav className="tabs">
            <button 
              className={activeTab === 'companies' ? 'active' : ''}
              onClick={() => setActiveTab('companies')}
            >
              Companies
            </button>
            <button 
              className={activeTab === 'jobs' ? 'active' : ''}
              onClick={() => setActiveTab('jobs')}
            >
              Job Search
            </button>
            <button 
              className={activeTab === 'saved-jobs' ? 'active' : ''}
              onClick={() => setActiveTab('saved-jobs')}
            >
              Saved Jobs
            </button>
          </nav>
          <button 
            className={`login-btn ${isLoggedIn ? 'logged-in' : ''}`}
            onClick={() => isLoggedIn ? handleLogout() : setShowLogin(true)}
          >
            {isLoggedIn ? 'LinkedIn ✓ (Logout)' : 'Login LinkedIn'}
          </button>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <main>
        {activeTab === 'companies' && (
          <>
            <div className="section-header">
              <h2>Company Management</h2>
              <button onClick={() => setShowAddForm(true)}>Add Company</button>
            </div>

            {showAddForm && (
              <Modal
                isOpen={showAddForm}
                onClose={() => setShowAddForm(false)}
                title="Add New Company"
              >
                <CompanyForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowAddForm(false)}
                  loading={loading}
                />
              </Modal>
            )}

            {editingCompany && (
              <Modal
                isOpen={!!editingCompany}
                onClose={() => setEditingCompany(null)}
                title="Edit Company"
              >
                <CompanyForm
                  company={editingCompany}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingCompany(null)}
                  loading={loading}
                />
              </Modal>
            )}

            <CompaniesTable
              companies={companies}
              onEdit={setEditingCompany}
              onDelete={handleDelete}
              loading={loading}
            />
          </>
        )}

        {activeTab === 'jobs' && (
          <>
            <div className="section-header">
              <h2>LinkedIn Job Search</h2>
            </div>
            <JobSearchForm onSearch={searchJobs} loading={loading} />
            <JobListings jobs={jobs} loading={loading} onSaveJob={handleSaveJob} />
          </>
        )}

        {activeTab === 'saved-jobs' && (
          <>
            <div className="section-header">
              <h2>Saved Jobs</h2>
            </div>
            <SavedJobsTable
              jobs={savedJobs}
              loading={loading}
              onUpdateStatus={handleUpdateJobStatus}
              onAutoApply={handleAutoApply}
            />
          </>
        )}
      </main>

      {showLogin && (
        <Modal
          isOpen={showLogin}
          onClose={() => setShowLogin(false)}
          title="LinkedIn Login"
        >
          <LinkedInLogin onLogin={handleLogin} loading={loading} />
        </Modal>
      )}
    </div>
  );
}

export default App;