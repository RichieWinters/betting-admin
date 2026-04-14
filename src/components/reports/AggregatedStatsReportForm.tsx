"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Button,
  Box,
  LinearProgress,
  Typography,
  Alert,
  CircularProgress,
  TextField,
} from '@mui/material';
import { useNotify } from 'react-admin';
import { apiClient } from '@/lib/api';
import { useReportWebSocket } from '@/hooks/useReportWebSocket';
import type { WebSocketStatusUpdate } from '@/types/reports';

export const AggregatedStatsReportForm = () => {
  const notify = useNotify();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [jobId, setJobId] = useState<string | null>(null);
  const [downloadReady, setDownloadReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const completedRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const handleCompletion = useCallback(() => {
    if (completedRef.current) return;

    completedRef.current = true;
    stopPolling();
    setIsGenerating(false);
    setDownloadReady(true);
    setProgress(100);
    notify('Report generated successfully', { type: 'success' });
  }, [notify, stopPolling]);

  const handleFailure = useCallback((errorMsg: string) => {
    if (completedRef.current) return;

    completedRef.current = true;
    stopPolling();
    setIsGenerating(false);
    setError(errorMsg);
    notify(errorMsg, { type: 'error' });
  }, [notify, stopPolling]);

  const { subscribe, unsubscribe } = useReportWebSocket({
    onStatusUpdate: (update: WebSocketStatusUpdate) => {
      if (!completedRef.current) {
        setProgress(update.progress || 0);
      }
    },
    onComplete: () => {
      handleCompletion();
    },
    onError: (errorMsg: string) => {
      handleFailure(errorMsg);
    },
  });

  const startPolling = useCallback((currentJobId: string) => {
    stopPolling();

    const interval = setInterval(async () => {
      if (completedRef.current) {
        stopPolling();
        return;
      }

      try {
        const status = await apiClient.getReportJobStatus(currentJobId);
        setProgress(status.progress || 0);

        if (status.status === 'completed') {
          handleCompletion();
        } else if (status.status === 'failed') {
          handleFailure('Report generation failed');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 2000);

    pollingIntervalRef.current = interval;
  }, [handleCompletion, handleFailure, stopPolling]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      notify('Please fill in all fields', { type: 'warning' });
      return;
    }

    setError(null);
    setIsGenerating(true);
    setProgress(0);
    setDownloadReady(false);
    completedRef.current = false;

    try {
      const response = await apiClient.requestAggregatedStatsReport({
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
      });

      setJobId(response.jobId);
      subscribe(response.jobId);

      startPolling(response.jobId);
    } catch (err: unknown) {
      setIsGenerating(false);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate report';
      setError(errorMessage);
      notify(errorMessage, { type: 'error' });
    }
  };

  const handleDownload = async () => {
    if (!jobId) return;

    try {
      const blob = await apiClient.downloadReport(jobId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `aggregated-stats-report-${Date.now()}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notify('Report downloaded successfully', { type: 'success' });

      if (jobId) {
        unsubscribe(jobId);
      }
      setJobId(null);
      setDownloadReady(false);
      setProgress(0);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to download report';
      setError(errorMessage);
      notify(errorMessage, { type: 'error' });
    }
  };

  const getStatusText = () => {
    if (downloadReady) return 'Report ready for download';
    if (isGenerating) {
      if (progress === 0) return 'Starting report generation...';
      if (progress < 100) return `Generating report... ${progress}%`;
      return 'Finalizing report...';
    }
    return '';
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Aggregated Statistics Report
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Generate a CSV report with aggregated betting statistics by month and sport type.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 600 }}>
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          disabled={isGenerating}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          disabled={isGenerating}
          fullWidth
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleGenerateReport}
            disabled={isGenerating || !startDate || !endDate}
            startIcon={isGenerating ? <CircularProgress size={20} /> : null}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>

          {downloadReady && (
            <Button
              variant="contained"
              color="success"
              onClick={handleDownload}
            >
              Download CSV
            </Button>
          )}
        </Box>

        {isGenerating && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {getStatusText()}
            </Typography>
            <LinearProgress variant="determinate" value={progress} />
          </Box>
        )}

        {downloadReady && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {getStatusText()}
          </Alert>
        )}
      </Box>
    </Box>
  );
};
