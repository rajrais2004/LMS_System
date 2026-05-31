# Loan Management System

A full-stack loan management system built with Next.js App Router, TypeScript, Tailwind CSS, Express, MongoDB, and JWT authentication.

## Features

- Borrower registration and login
- Multi-step borrower loan flow with BRE validation
- Role-based dashboard modules for Sales, Sanction, Disbursement, Collection, and Admin
- Loan lifecycle timeline and audit logging
- File upload for salary slips (PDF/JPG/PNG, max 5MB)
- Responsive UI with dark/light mode
- Seeded users for all roles
- Docker Compose for local development

## Setup

1. Copy `.env.example` to `.env` in `apps/api` and update values.
2. Install dependencies from the repo root:
   ```bash
   npm install
   ```
3. Start services:
   ```bash
   npm run dev
   ```

## Credentials

- Admin: admin@lms.com / Pass@123
- Sales: sales@lms.com / Pass@123
- Sanction: sanction@lms.com / Pass@123
- Disbursement: disbursement@lms.com / Pass@123
- Collection: collection@lms.com / Pass@123
- Borrower: borrower@lms.com / Pass@123

## Docker

```bash
docker compose up --build
```

## Deployment

- Build with `npm run build`
- Start with `npm run start`

## Notes

- API listens on port `4000`
- Frontend listens on port `3000`
