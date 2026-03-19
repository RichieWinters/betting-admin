"use client";

import { useState } from 'react';
import { Box, Tabs, Tab, Paper, Typography } from '@mui/material';
import { Title } from 'react-admin';
import { UserBetsReportForm } from './UserBetsReportForm';
import { AggregatedStatsReportForm } from './AggregatedStatsReportForm';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`report-tabpanel-${index}`}
      aria-labelledby={`report-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

export const ReportsPage = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Title title="Reports" />

      <Paper sx={{ mb: 3, p: 2 }}>
        <Typography variant="h5" gutterBottom>
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Generate and download CSV reports for betting data analysis.
        </Typography>
      </Paper>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="report tabs"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="User Bets" id="report-tab-0" aria-controls="report-tabpanel-0" />
          <Tab label="Aggregated Stats" id="report-tab-1" aria-controls="report-tabpanel-1" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <UserBetsReportForm />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <AggregatedStatsReportForm />
        </TabPanel>
      </Paper>
    </Box>
  );
};
