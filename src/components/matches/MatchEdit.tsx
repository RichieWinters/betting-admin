"use client";

import {
  Edit,
  SimpleForm,
  SelectInput,
  TextInput,
  required,
  useRecordContext,
} from 'react-admin';
import { Status } from '@/types';

const WinnerInput = () => {
  const record = useRecordContext();
  
  if (!record || record.status !== Status.COMPLETED) {
    return null;
  }

  return (
    <TextInput
      source="winner"
      label="Winner"
      validate={[required()]}
      fullWidth
      helperText="Enter the winning team name (must match Team A or Team B)"
    />
  );
};

export const MatchEdit = () => (
  <Edit>
    <SimpleForm>
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
