// src/types/api.ts - API response type definitions

import { User, Job } from './index.ts';

export interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

export interface GetJobsResponse {
  success: boolean;
  jobs?: Job[];
  error?: string;
}

export interface CreateJobResponse {
  success: boolean;
  job?: Job;
  error?: string;
}

export interface UpdateJobResponse {
  success: boolean;
  job?: Job;
  error?: string;
}

export interface ApiResponse {
  success: boolean;
  error?: string;
}