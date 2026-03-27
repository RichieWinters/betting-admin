import { DataProvider } from 'react-admin';
import { apiClient } from './api';

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    let data: any[] = [];

    switch (resource) {
      case 'users':
        data = await apiClient.getUsers();
        break;
      case 'matches':
        data = await apiClient.getMatches();
        break;
      case 'bets':
        data = await apiClient.getBets();
        break;
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }

    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };

    let sortedData = [...data];
    if (field) {
      sortedData.sort((a, b) => {
        const aVal = a[field];
        const bVal = b[field];
        
        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        
        const comparison = aVal < bVal ? -1 : 1;
        return order === 'ASC' ? comparison : -comparison;
      });
    }

    const start = (page - 1) * perPage;
    const end = start + perPage;
    const paginatedData = sortedData.slice(start, end);

    return {
      data: paginatedData,
      total: data.length,
    };
  },

  getOne: async (resource, params) => {
    let data: any[] = [];

    switch (resource) {
      case 'users':
        data = await apiClient.getUsers();
        break;
      case 'matches':
        data = await apiClient.getMatches();
        break;
      case 'bets':
        data = await apiClient.getBets();
        break;
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }

    const id = typeof params.id === 'string' ? parseInt(params.id, 10) : params.id;
    const item = data.find((item) => item.id === id);
    if (!item) {
      throw new Error(`${resource} not found`);
    }

    return { data: item };
  },

  getMany: async (resource, params) => {
    let data: any[] = [];

    switch (resource) {
      case 'users':
        data = await apiClient.getUsers();
        break;
      case 'matches':
        data = await apiClient.getMatches();
        break;
      case 'bets':
        data = await apiClient.getBets();
        break;
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }

    const filteredData = data.filter((item) => params.ids.includes(item.id));
    return { data: filteredData };
  },

  getManyReference: async (resource, params) => {
    let data: any[] = [];

    switch (resource) {
      case 'users':
        data = await apiClient.getUsers();
        break;
      case 'matches':
        data = await apiClient.getMatches();
        break;
      case 'bets':
        data = await apiClient.getBets();
        break;
      default:
        throw new Error(`Unknown resource: ${resource}`);
    }

    const filteredData = data.filter(
      (item) => item[params.target] === params.id
    );

    return {
      data: filteredData,
      total: filteredData.length,
    };
  },

  create: async (resource, params) => {
    switch (resource) {
      case 'matches':
        const match = await apiClient.createMatch(params.data);
        return { data: match };
      default:
        throw new Error(`Create not supported for resource: ${resource}`);
    }
  },

  update: async (resource, params) => {
    switch (resource) {
      case 'users':
        if (params.data.action === 'ban') {
          const user = await apiClient.banUser(params.id as number);
          return { data: user };
        } else if (params.data.action === 'unban') {
          const user = await apiClient.unbanUser(params.id as number);
          return { data: user };
        }
        throw new Error('Invalid user action');
      case 'matches':
        const match = await apiClient.updateMatch(params.id as number, params.data);
        return { data: match };
      default:
        throw new Error(`Update not supported for resource: ${resource}`);
    }
  },

  updateMany: async (resource, params) => {
    throw new Error('updateMany not implemented');
  },

  delete: async (resource, params) => {
    switch (resource) {
      case 'matches':
        const match = await apiClient.deleteMatch(params.id as number);
        return { data: match };
      default:
        throw new Error(`Delete not supported for resource: ${resource}`);
    }
  },

  deleteMany: async (resource, params) => {
    throw new Error('deleteMany not supported');
  },
};
