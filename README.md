# Betting Admin Panel

A React Admin panel for managing a betting platform with user management, match creation, and bet monitoring.

## Features

- **Authentication**: JWT-based admin login with role verification
- **User Management**: View all users, ban/unban accounts
- **Match Management**: Create matches, update status and winners
- **Bet Monitoring**: View all bets with win/loss calculations

## Tech Stack

- Next.js
- React Admin
- TypeScript
- Tailwind CSS

## Prerequisites

- Node.js 18+
- Running NestJS backend API
- Admin user account in the database

## Setup

1. Install dependencies:

```bash
npm install
```

1. Configure environment variables:

Create `.env` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

Replace with your backend API URL.

1. Run the development server:

```bash
npm run dev
```

## API Endpoints Used

All requests include `Authorization: Bearer <token>` header.

| Method | Endpoint         | Description   | Role   |
| ------ | ---------------- | ------------- | ------ |
| POST   | /auth/login      | Admin login   | Public |
| GET    | /users           | List users    | ADMIN  |
| PATCH  | /users/:id/ban   | Ban user      | ADMIN  |
| PATCH  | /users/:id/unban | Unban user    | ADMIN  |
| GET    | /matches         | List matches  | AUTH   |
| POST   | /matches         | Create match  | ADMIN  |
| PATCH  | /matches/:id     | Update match  | ADMIN  |
| GET    | /bets            | List all bets | ADMIN  |
