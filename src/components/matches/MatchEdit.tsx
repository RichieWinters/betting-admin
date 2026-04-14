"use client";

import {
  Edit,
  SimpleForm,
  SelectInput,
  AutocompleteInput,
  required,
  useRecordContext,
  useInput,
  Toolbar,
  SaveButton,
} from 'react-admin';
import { Status } from '@/types';

const WinnerInput = () => {
  const record = useRecordContext();
  const { field: statusField } = useInput({ source: 'status' });
  const showWinner = statusField.value === Status.COMPLETED;

  if (!showWinner) {
    return null;
  }

  const winnerChoices = [
    { id: record?.teamA || '', name: record?.teamA || 'Team A' },
    { id: record?.teamB || '', name: record?.teamB || 'Team B' },
  ].filter(choice => choice.id);

  return (
    <AutocompleteInput
      source="winner"
      label="Winner"
      choices={winnerChoices}
      validate={[required()]}
      fullWidth
      helperText="Select or type the winner team"
    />
  );
};

const CustomToolbar = () => (
  <Toolbar>
    <SaveButton />
  </Toolbar>
);

export const MatchEdit = () => (
  <Edit>
    <SimpleForm toolbar={<CustomToolbar />}>
      <SelectInput
        source="status"
        label="Match Status"
        choices={[
          { id: Status.PENDING, name: 'Pending' },
          { id: Status.IN_PROGRESS, name: 'In Progress' },
          { id: Status.COMPLETED, name: 'Completed' },
          { id: Status.CANCELLED, name: 'Cancelled' },
        ]}
        validate={[required()]}
        fullWidth
      />
      <WinnerInput />
    </SimpleForm>
  </Edit>
);
