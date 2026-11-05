# CareDesk – Healthcare Appointment Dashboard

A React + Vite frontend portfolio project demonstrating a healthcare appointment-management interface.

## Features
- Appointment overview cards
- Search by patient, physician, department, or reason
- Filter appointments by status
- Create appointment records with basic form validation
- Update appointment status
- Responsive layout for desktop and mobile
- Browser `localStorage` persistence

## Run locally
1. Install Node.js (LTS).
2. Extract this folder and open a terminal in it.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the local URL printed by Vite.

## Build
Run `npm run build`.

## Important scope note
This is a frontend demonstration with sample data. It does **not** connect to a backend, authenticate users, or store real patient information. Do not enter real or sensitive medical data. To claim REST API integration on a resume, implement and test a real backend/API connection first.

## Suggested next improvements
- Build a FastAPI backend with appointment and physician endpoints.
- Add PostgreSQL persistence and server-side validation.
- Add authentication and role-based access.
- Write component and API integration tests.
