import axios from 'axios';
import { type Job, type Application, type JobFetchRequest, type JobFetchResponse, type MarkAppliedRequest } from '../types';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
  fetchJobs: async (data: JobFetchRequest): Promise<JobFetchResponse> => {
    const response = await axios.post<JobFetchResponse>(`${API_BASE_URL}/jobs/fetch`, data);
    return response.data;
  },

  getJobs: async (limit = 100, offset = 0): Promise<Job[]> => {
    const response = await axios.get<Job[]>(`${API_BASE_URL}/jobs`, {
      params: { limit, offset }
    });
    return response.data;
  },

  getApplications: async (limit = 100, offset = 0): Promise<Application[]> => {
    const response = await axios.get<Application[]>(`${API_BASE_URL}/applications`, {
      params: { limit, offset }
    });
    return response.data;
  },

  getJobsCount: async (): Promise<number> => {
    const response = await axios.get<Job[]>(`${API_BASE_URL}/jobs`, {
      params: { limit: 1000, offset: 0 }
    });
    return response.data.length;
  },

  getApplicationsCount: async (): Promise<number> => {
    const response = await axios.get<Application[]>(`${API_BASE_URL}/applications`, {
      params: { limit: 1000, offset: 0 }
    });
    return response.data.length;
  },

  markApplied: async (data: MarkAppliedRequest): Promise<{ message: string; success: boolean }> => {
    const response = await axios.post(`${API_BASE_URL}/jobs/mark-applied`, data);
    return response.data;
  }
};
