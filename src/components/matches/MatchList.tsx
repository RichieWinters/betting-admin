"use client";

import {
  List,
  Datagrid,
  TextField,
  DateField,
  FunctionField,
  useRecordContext,
} from 'react-admin';
import { Match, Status, SportType } from '@/types';
import { LocalizedDateField } from '@/components/common/LocalizedDateField';
import { MatchDeleteButton } from './MatchDeleteButton';

const StatusBadge = () => {
  const record = useRecordContext<Match>();
  if (!record) return null;

  const getStatusColor = (status: Status) => {
    switch (status) {
      case Status.PENDING:
        return 'bg-[#007AFF] text-white';
      case Status.IN_PROGRESS:
        return 'bg-[#FF9500] text-white';
      case Status.COMPLETED:
        return 'bg-[#34C759] text-white';
      case Status.CANCELLED:
        return 'bg-[#8E8E93] text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
        record.status
      )}`}
    >
      {record.status}
    </span>
  );
};

const SportBadge = () => {
  const record = useRecordContext<Match>();
  if (!record) return null;

  const getSportIcon = (sportType: SportType) => {
    switch (sportType) {
      case SportType.DOTA2:
        return '🎮';
      case SportType.COUNTER_STRIKE:
        return '🔫';
      case SportType.FORTNITE:
        return '🏗️';
      default:
        return '🎯';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-base">{getSportIcon(record.sportType)}</span>
      <span className="text-sm font-medium">
        {record.sportType.replace('_', ' ')}
      </span>
    </div>
  );
};

const TeamsField = () => {
  const record = useRecordContext<Match>();
  if (!record) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="font-semibold">{record.teamA}</span>
      <span className="text-gray-400 text-sm">VS</span>
      <span className="font-semibold">{record.teamB}</span>
    </div>
  );
};

export const MatchList = () => (
  <List>
    <Datagrid rowClick="edit" bulkActionButtons={false}>
      <TextField source="id" />
      <FunctionField label="Sport" render={() => <SportBadge />} />
      <FunctionField label="Teams" render={() => <TeamsField />} />
      <FunctionField label="Date" render={() => <LocalizedDateField source="date" />} />
      <FunctionField label="Status" render={() => <StatusBadge />} />
      <TextField source="winner" emptyText="-" />
      <FunctionField label="Actions" render={() => <MatchDeleteButton />} />
    </Datagrid>
  </List>
);
