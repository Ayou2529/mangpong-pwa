// src/types/user.ts - User type definitions

export interface User {
  username: string;
  fullName: string;
  phone: string;
  email: string;
  role: 'messenger' | 'admin' | 'owner';
  createdAt: string;
  lastLogin: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  phone: string;
  email: string;
}