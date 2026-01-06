export interface JobListing {
  title: string;
  company: string;
  location: string;
  link: string;
  isEasyApply?: boolean;
}

export enum ApplicationStatus {
  NOT_APPLIED = 'not_applied',
  SAVED = 'saved',
  APPLIED = 'applied',
  REJECTED = 'rejected',
  INTERVIEW = 'interview',
}

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  description?: string;
  status: ApplicationStatus;
  isEasyApply: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaveJobDto {
  title: string;
  company: string;
  location: string;
  linkedinUrl: string;
  description?: string;
  isEasyApply?: boolean;
}