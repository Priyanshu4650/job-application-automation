import axios from 'axios';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';
import type { JobListing, SavedJob, SaveJobDto, ApplicationStatus } from '../types/job';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const companiesApi = {
  getAll: (): Promise<Company[]> =>
    api.get('/admin/companies').then(res => res.data),

  create: (data: CreateCompanyDto): Promise<Company> =>
    api.post('/admin/companies', data).then(res => res.data),

  update: (id: string, data: UpdateCompanyDto): Promise<Company> =>
    api.put(`/admin/companies/${id}`, data).then(res => res.data),

  delete: (id: string): Promise<Company> =>
    api.delete(`/admin/companies/${id}`).then(res => res.data),
};

export const jobsApi = {
  searchLinkedIn: (search: string, location?: string): Promise<JobListing[]> =>
    api.get('/scraper/linkedin-jobs', { params: { search, location } }).then(res => res.data),

  login: (email: string, password: string): Promise<{ success: boolean; message: string }> =>
    api.post('/scraper/login', { email, password }).then(res => res.data),

  getLoginStatus: (): Promise<{ isLoggedIn: boolean }> =>
    api.get('/scraper/status').then(res => res.data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    api.post('/scraper/logout').then(res => res.data),

  saveJob: (data: SaveJobDto): Promise<SavedJob> =>
    api.post('/jobs/save', data).then(res => res.data),

  getSavedJobs: (status?: ApplicationStatus): Promise<SavedJob[]> =>
    api.get('/jobs', { params: status ? { status } : {} }).then(res => res.data),

  updateJobStatus: (id: string, status: ApplicationStatus): Promise<SavedJob> =>
    api.put(`/jobs/${id}/status`, { status }).then(res => res.data),

  autoApply: (id: string): Promise<{ success: boolean; message: string }> =>
    api.post(`/jobs/auto-apply/${id}`).then(res => res.data),
};