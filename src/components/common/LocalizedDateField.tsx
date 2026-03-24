"use client";

import { useRecordContext } from 'react-admin';
import { formatLocalizedDate } from '@/lib/dateFormatter';

interface LocalizedDateFieldProps {
  source: string;
}

export const LocalizedDateField = ({ source }: LocalizedDateFieldProps) => {
  const record = useRecordContext();
  if (!record || !record[source]) return null;

  return <span>{formatLocalizedDate(record[source])}</span>;
};
