import type { User, AuthResponse } from '@/types';
import type {
  UserBetsReportParams,
  AggregatedStatsReportParams,
  ReportJobResponse,
  ReportJobStatus,
} from '@/types/reports';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

console.log('API_URL configured as:', API_URL);

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    console.log('ApiClient initialized with baseUrl:', this.baseUrl);
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw {
        status: response.status,
        message: error.message || 'An error occurred',
        data: error,
      };
    }

    return response.json();
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<AuthResponse> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async getCurrentUser(): Promise<User> {
    return this.request<User>('/users/me');
  }

  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async banUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/ban`, {
      method: 'PATCH',
    });
  }

  async unbanUser(id: number): Promise<User> {
    return this.request<User>(`/users/${id}/unban`, {
      method: 'PATCH',
    });
  }

  async getMatches(): Promise<any[]> {
    return this.request<any[]>('/matches');
  }

  async createMatch(data: any): Promise<any> {
    return this.request<any>('/matches', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateMatch(id: number, data: any): Promise<any> {
    return this.request<any>(`/matches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteMatch(id: number): Promise<any> {
    return this.request<any>(`/matches/${id}`, {
      method: 'DELETE',
    });
  }

  async getBets(): Promise<any[]> {
    return this.request<any[]>('/bets');
  }

  async requestUserBetsReport(
    params: UserBetsReportParams,
  ): Promise<ReportJobResponse> {
    return this.request<ReportJobResponse>('/reports/user-bets', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async requestAggregatedStatsReport(
    params: AggregatedStatsReportParams,
  ): Promise<ReportJobResponse> {
    return this.request<ReportJobResponse>('/reports/aggregated-stats', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  async getReportJobStatus(jobId: string): Promise<ReportJobStatus> {
    return this.request<ReportJobStatus>(`/reports/${jobId}/status`);
  }

  async downloadReport(jobId: string): Promise<Blob> {
    const token = this.getToken();
    const headers: Record<string, string> = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}/reports/${jobId}/download`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      }));
      throw {
        status: response.status,
        message: error.message || 'Download failed',
        data: error,
      };
    }

    return response.blob();
  }
}

export const apiClient = new ApiClient(API_URL);

export const saveToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};
