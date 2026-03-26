"use client";
import { Admin, Resource, Notification } from "react-admin";
import { authProvider } from "@/lib/authProvider";
import { dataProvider } from "@/lib/dataProvider";
import { UserList } from "@/components/users/UserList";
import { MatchList } from "@/components/matches/MatchList";
import { MatchCreate } from "@/components/matches/MatchCreate";
import { MatchEdit } from "@/components/matches/MatchEdit";
import { BetList } from "@/components/bets/BetList";
import { CustomLoginPage } from "@/components/auth/CustomLoginPage";
import { ReportsPage } from "@/components/reports/ReportsPage";

const CustomNotification = () => (
  <Notification anchorOrigin={{ vertical: 'top', horizontal: 'center' }} />
);

const AdminApp = () => (
  <Admin
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={CustomLoginPage}
    notification={CustomNotification}
    theme={{
      palette: {
        primary: {
          main: '#007AFF',
        },
        secondary: {
          main: '#34C759',
        },
        error: {
          main: '#FF3B30',
        },
        warning: {
          main: '#FF9500',
        },
      },
      typography: {
        fontFamily: 'Arial, Helvetica, sans-serif',
      },
      shape: {
        borderRadius: 8,
      },
    }}
  >
    <Resource
      name="users"
      list={UserList}
      options={{ label: 'Users' }}
    />
    <Resource
      name="matches"
      list={MatchList}
      create={MatchCreate}
      edit={MatchEdit}
      options={{ label: 'Matches' }}
    />
    <Resource
      name="bets"
      list={BetList}
      options={{ label: 'Bets' }}
    />
    <Resource
      name="reports"
      list={ReportsPage}
      options={{ label: 'Reports' }}
    />
  </Admin>
);

export default AdminApp;