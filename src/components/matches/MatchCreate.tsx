"use client";

import {
  Create,
  SimpleForm,
  TextInput,
  DateTimeInput,
  SelectInput,
  required,
} from 'react-admin';
import { SportType } from '@/types';

export const MatchCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <DateTimeInput
        source="date"
        label="Match Date & Time"
        validate={[required()]}
        fullWidth
      />
      <SelectInput
        source="sportType"
        label="Sport Type"
        choices={[
          { id: SportType.DOTA2, name: 'Dota 2' },
          { id: SportType.COUNTER_STRIKE, name: 'Counter Strike' },
          { id: SportType.FORTNITE, name: 'Fortnite' },
        ]}
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="teamA"
        label="Team A"
        validate={[required()]}
        fullWidth
      />
      <TextInput
        source="teamB"
        label="Team B"
        validate={[required()]}
        fullWidth
      />
    </SimpleForm>
  </Create>
);
