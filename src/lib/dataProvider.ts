import type {
  DataProvider,
  GetListParams,
  GetOneParams,
  GetManyParams,
  GetManyReferenceParams,
  CreateParams,
  UpdateParams,
  UpdateManyParams,
  DeleteParams,
  DeleteManyParams,
} from 'react-admin';
import type { User, Match, Bet } from '@/types';
import { apiClient } from './api';

type AppRecord = User | Match | Bet;

async function fetchAll(resource: string): Promise<AppRecord[]> {
  switch (resource) {
    case 'users':
      return apiClient.getUsers();
    case 'matches':
      return apiClient.getMatches();
    case 'bets':
      return apiClient.getBets();
    default:
      throw new Error(`Unknown resource: ${resource}`);
  }
}

const dataProviderImpl = {
  getList: async (resource: string, params: GetListParams) => {
    const data = await fetchAll(resource);

    const { page = 1, perPage = 10 } = params.pagination || {};
    const { field, order } = params.sort || { field: 'id', order: 'ASC' };

    const sortedData = [...data];
    if (field) {
      sortedData.sort((a, b) => {
        const aVal = (a as unknown as Record<string, unknown>)[field];
        const bVal = (b as unknown as Record<string, unknown>)[field];

        if (aVal === bVal) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        return (aVal < bVal ? -1 : 1) * (order === 'ASC' ? 1 : -1);
      });
    }

    const start = (page - 1) * perPage;
    const paginatedData = sortedData.slice(start, start + perPage);

    return { data: paginatedData, total: data.length };
  },

  getOne: async (resource: string, params: GetOneParams) => {
    const data = await fetchAll(resource);
    const id =
      typeof params.id === 'string' ? parseInt(params.id, 10) : params.id;
    const item = data.find((r) => r.id === id);
    if (!item) throw new Error(`${resource} not found`);
    return { data: item };
  },

  getMany: async (resource: string, params: GetManyParams) => {
    const data = await fetchAll(resource);
    return { data: data.filter((r) => params.ids.includes(r.id)) };
  },

  getManyReference: async (
    resource: string,
    params: GetManyReferenceParams,
  ) => {
    const data = await fetchAll(resource);
    const filtered = data.filter(
      (r) =>
        (r as unknown as Record<string, unknown>)[params.target] === params.id,
    );
    return { data: filtered, total: filtered.length };
  },

  create: async (resource: string, params: CreateParams) => {
    switch (resource) {
      case 'matches':
        return { data: await apiClient.createMatch(params.data) };
      default:
        throw new Error(`Create not supported for resource: ${resource}`);
    }
  },

  update: async (resource: string, params: UpdateParams) => {
    switch (resource) {
      case 'users':
        if (params.data.action === 'ban')
          return { data: await apiClient.banUser(params.id as number) };
        if (params.data.action === 'unban')
          return { data: await apiClient.unbanUser(params.id as number) };
        throw new Error('Invalid user action');
      case 'matches':
        return {
          data: await apiClient.updateMatch(params.id as number, params.data),
        };
      default:
        throw new Error(`Update not supported for resource: ${resource}`);
    }
  },

  updateMany: async (_resource: string, _params: UpdateManyParams) => {
    throw new Error('updateMany not implemented');
  },

  delete: async (resource: string, params: DeleteParams) => {
    switch (resource) {
      case 'matches':
        return { data: await apiClient.deleteMatch(params.id as number) };
      default:
        throw new Error(`Delete not supported for resource: ${resource}`);
    }
  },

  deleteMany: async (_resource: string, _params: DeleteManyParams) => {
    throw new Error('deleteMany not supported');
  },
};

export const dataProvider = dataProviderImpl as unknown as DataProvider;
