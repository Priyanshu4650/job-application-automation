export interface Job {
  id: number;
  title: string;
  company: string;
  location: string | null;
  url: string | null;
  salary_range: string | null;
  posted_date: string | null;
  created_at: string;
}

export interface Application {
  id: number;
  job_id: number;
  status: string;
  applied_at: string;
  notes: string | null;
}

export interface JobFetchRequest {
  role: string;
  location: string;
  platform: string;
}

export interface JobFetchResponse {
  message: string;
  count: number;
}

export interface MarkAppliedRequest {
  job_id: number;
  user_id: number;
}
