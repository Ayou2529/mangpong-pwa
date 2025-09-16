// src/types/job.ts - Job type definitions

export interface JobDetail {
  company: string;
  deliveryProvince: string;
  deliveryDistrict: string;
  recipientName: string;
  description: string;
  amount: number;
}

export interface Job {
  jobId: string;
  jobDate: string;
  company: string;
  assignerName: string;
  assignerContact: string;
  pickupProvince: string;
  pickupDistrict: string;
  jobDetails: JobDetail[];
  mainServiceFee: number;
  totalAmount: number;
  status: 'draft' | 'incomplete' | 'complete';
  incompleteReason?: string;
  username: string;
  createdAt: string;
  updatedAt: string;
}

export interface JobFormData {
  jobId?: string;
  jobDate: string;
  company: string;
  assignerName: string;
  assignerContact: string;
  pickupProvince: string;
  pickupDistrict: string;
  jobDetails: JobDetail[];
  mainServiceFee: number;
  totalAmount: number;
}