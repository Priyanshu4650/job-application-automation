import axios from 'axios';
import type { Company, CreateCompanyDto, UpdateCompanyDto } from '../types/company';

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