"use client";

import {
  List,
  Datagrid,
  TextField,
  EmailField,
  NumberField,
  useRecordContext,
  useDataProvider,
  useNotify,
  useRefresh,
  FunctionField,
} from 'react-admin';
import { User, Role } from '@/types';
import { LocalizedDateField } from '@/components/common/LocalizedDateField';

const BanActionButton = () => {
  const record = useRecordContext<User>();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  if (!record) return null;

  const handleBanToggle = async () => {
    setLoading(true);
    try {
      await dataProvider.update('users', {
        id: record.id,
        data: { action: record.isBanned ? 'unban' : 'ban' },
        previousData: record,
      });
      notify(
        record.isBanned ? 'User unbanned successfully' : 'User banned successfully',
        { type: 'success' }
      );
      refresh();
    } catch (error: unknown) {
      notify(error instanceof Error ? error.message : 'Action failed', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleBanToggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-60 ${
        record.isBanned
          ? 'bg-green-500 hover:bg-green-600 text-white'
          : 'bg-red-500 hover:bg-red-600 text-white'
      }`}
    >
      {loading ? '...' : record.isBanned ? 'Unban' : 'Ban'}
    </button>
  );
};

const RoleBadge = () => {
  const record = useRecordContext<User>();
  if (!record) return null;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        record.role === Role.ADMIN
          ? 'bg-purple-100 text-purple-800'
          : 'bg-gray-100 text-gray-800'
      }`}
    >
      {record.role}
    </span>
  );
};

const BannedBadge = () => {
  const record = useRecordContext<User>();
  if (!record) return null;

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        record.isBanned
          ? 'bg-red-100 text-red-800'
          : 'bg-green-100 text-green-800'
      }`}
    >
      {record.isBanned ? 'Banned' : 'Active'}
    </span>
  );
};

import { useState } from 'react';

export const UserList = () => (
  <List>
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" />
      <TextField source="name" />
      <EmailField source="email" />
      <FunctionField label="Role" render={() => <RoleBadge />} />
      <NumberField
        source="balance"
        options={{ style: 'decimal', minimumFractionDigits: 2 }}
      />
      <FunctionField label="Status" render={() => <BannedBadge />} />
      <FunctionField label="Created At" render={() => <LocalizedDateField source="createdAt" />} />
      <FunctionField label="Actions" render={() => <BanActionButton />} />
    </Datagrid>
  </List>
);
