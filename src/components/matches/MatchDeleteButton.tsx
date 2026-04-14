"use client";

import { useState } from 'react';
import {
  useRecordContext,
  useNotify,
  useRefresh,
  useDelete,
  Button,
} from 'react-admin';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Match, Status } from '@/types';

export const MatchDeleteButton = () => {
  const record = useRecordContext<Match>();
  const [open, setOpen] = useState(false);
  const [deleteOne, { isLoading }] = useDelete();
  const notify = useNotify();
  const refresh = useRefresh();

  if (!record) return null;

  if (record.status === Status.COMPLETED) {
    return null;
  }

  const handleDelete = async () => {
    try {
      await deleteOne('matches', { id: record.id, previousData: record });
      notify('Match deleted successfully. Pending bets have been refunded.', { type: 'success' });
      refresh();
      setOpen(false);
    } catch (error: unknown) {
      notify(error instanceof Error ? error.message : 'Error deleting match', { type: 'error' });
      setOpen(false);
    }
  };

  return (
    <>
      <Button
        label=""
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        disabled={isLoading}
      >
        <DeleteIcon className="text-red-500" />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        onClick={(e) => e.stopPropagation()}
      >
        <DialogTitle>Delete Match</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this match between <strong>{record.teamA}</strong> vs <strong>{record.teamB}</strong>?
            <br />
            All pending bets will be cancelled and refunded to users.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpen(false)} color="primary">
            Cancel
          </MuiButton>
          <MuiButton onClick={handleDelete} color="error" disabled={isLoading}>
            Delete
          </MuiButton>
        </DialogActions>
      </Dialog>
    </>
  );
};
