export enum ReportType {
  USER_BETS = 'user-bets',
  AGGREGATED_STATS = 'aggregated-stats',
}

export interface UserBetsReportParams {
  userId: number;
  startDate: string;
  endDate: string;
}

export interface AggregatedStatsReportParams {
  startDate: string;
  endDate: string;
}

export type ReportParams = UserBetsReportParams | AggregatedStatsReportParams;

export enum JobStatus {
  WAITING = 'waiting',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  FAILED = 'failed',
  DELAYED = 'delayed',
}

export interface ReportJobResult {
  filename: string;
  csv?: string;
}

export interface ReportJobStatus {
  jobId: string;
  status: JobStatus;
  progress: number;
  result?: ReportJobResult;
}

export interface ReportJobResponse {
  jobId: string;
}

export interface WebSocketStatusUpdate {
  jobId: string;
  status: string;
  timestamp: string;
  progress?: number;
  error?: string;
  result?: ReportJobResult;
}
