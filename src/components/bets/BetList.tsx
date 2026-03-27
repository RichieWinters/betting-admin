"use client";

import {
  List,
  Datagrid,
  TextField,
  NumberField,
  DateField,
  FunctionField,
  useRecordContext,
} from 'react-admin';
import { Bet, Status } from '@/types';
import { LocalizedDateField } from '@/components/common/LocalizedDateField';

const UserNameField = () => {
  const record = useRecordContext<Bet>();
  if (!record) return null;
  return <span>{record.user.name}</span>;
};

const MatchField = () => {
  const record = useRecordContext<Bet>();
  if (!record) return null;

  return (
    <div className="flex items-center gap-2">
      <span className="font-medium">{record.match.teamA}</span>
      <span className="text-gray-400 text-sm">vs</span>
      <span className="font-medium">{record.match.teamB}</span>
    </div>
  );
};

const BetTeamField = () => {
  const record = useRecordContext<Bet>();
  if (!record) return null;

  return (
    <span className="font-semibold text-[#007AFF]">{record.team}</span>
  );
};

const MatchStatusBadge = () => {
  const record = useRecordContext<Bet>();
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
        record.match.status
      )}`}
    >
      {record.match.status}
    </span>
  );
};

const ResultBadge = () => {
  const record = useRecordContext<Bet>();
  if (!record) return null;

  if (!record.result) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
        Pending
      </span>
    );
  }

  const isWin = record.result.toLowerCase() === 'win';

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${isWin
          ? 'bg-[#34C759] text-white'
          : 'bg-[#FF3B30] text-white'
        }`}
    >
      {record.result}
    </span>
  );
};

export const BetList = () => (
  <List>
    <Datagrid bulkActionButtons={false}>
      <TextField source="id" />
      <FunctionField label="User" render={() => <UserNameField />} />
      <FunctionField label="Match" render={() => <MatchField />} />
      <FunctionField label="Bet On" render={() => <BetTeamField />} />
      <NumberField
        source="amount"
        options={{ style: 'decimal', minimumFractionDigits: 2 }}
        label="Amount (coins)"
      />
      <FunctionField label="Match Status" render={() => <MatchStatusBadge />} />
      <FunctionField label="Result" render={() => <ResultBadge />} />
      <FunctionField label="Placed At" render={() => <LocalizedDateField source="createdAt" />} />
    </Datagrid>
  </List>
);
