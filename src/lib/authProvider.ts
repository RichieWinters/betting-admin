import { AuthProvider } from 'react-admin';
import { apiClient, saveToken, getToken, removeToken } from './api';
import { Role } from '@/types';

export const authProvider: AuthProvider = {
  login: async ({ username, password }) => {
    try {
      const response = await apiClient.login(username, password);
      
      if (response.user.role !== Role.ADMIN) {
        throw new Error('Access denied. Admin privileges required.');
      }

      saveToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return Promise.resolve();
    } catch (error: any) {
      return Promise.reject(
        new Error(error.message || 'Login failed. Please check your credentials.')
      );
    }
  },

  logout: async () => {
    removeToken();
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  checkAuth: async () => {
    const token = getToken();
    if (!token) {
      return Promise.reject({ message: false });
    }

    try {
      const user = await apiClient.getCurrentUser();
      
      if (user.role !== Role.ADMIN) {
        removeToken();
        localStorage.removeItem('user');
        return Promise.reject(new Error('Admin access required'));
      }

      if (user.isBanned) {
        removeToken();
        localStorage.removeItem('user');
        return Promise.reject(new Error('Account is banned'));
      }

      localStorage.setItem('user', JSON.stringify(user));
      return Promise.resolve();
    } catch (error) {
      removeToken();
      localStorage.removeItem('user');
      return Promise.reject({ message: false });
    }
  },

  checkError: async (error) => {
    const status = error.status;
    if (status === 401 || status === 403) {
      removeToken();
      localStorage.removeItem('user');
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getIdentity: async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return Promise.reject();
    }

    try {
      const user = JSON.parse(userStr);
      return Promise.resolve({
        id: user.id,
        fullName: user.name,
        avatar: undefined,
      });
    } catch {
      return Promise.reject();
    }
  },

  getPermissions: async () => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      return Promise.reject();
    }

    try {
      const user = JSON.parse(userStr);
      return Promise.resolve(user.role);
    } catch {
      return Promise.reject();
    }
  },
};
