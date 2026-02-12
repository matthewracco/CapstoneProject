# COMP 3078 Capstone Project - Locker Rental System

## Team Members
- Matthew Racco
- Gurnoor Khurana
- Koorosh Farvardin
- Kien Vu Tran

## Project Overview

A multi-tenant digital platform for managing locker rentals across different facilities (airports, schools, gyms, offices, public venues). This replaces manual locker handling with a mobile-first, QR-based rental experience.

**Status:** Phase 1 (Backend Foundation) - In Progress

## Quick Start

See [backend/SETUP.md](backend/SETUP.md) for detailed setup instructions.

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Server runs on `http://localhost:5000`

## Project Structure

```
locker-rental-system/
├── backend/          # Node.js + Express API (Phase 1)
├── mobile/           # React Native app (Phase 3)
├── dashboard/        # React admin dashboard (Phase 4)
└── docs/            # Design documents
```

## Development Phases

**Phase 1:** Backend foundation (JWT auth, user signup/login, rental flow)
**Phase 2:** Core data models and rental workflow
**Phase 3:** Mobile app (Expo + React Native)
**Phase 4:** Admin dashboard (React + Vite)
**Phase 5:** Polish, testing, optional features

## In Scope
- Digital locker rental workflows
- Mobile application for end users
- Web-based dashboard for management
- Configurable access rules per facility
- Mock payment handling
- Reporting and analytics
- Cloud-ready backend architecture

## Out of Scope
- Physical locker hardware or firmware
- Real payment processing
- Facial recognition or biometric access
- NFC-based access
- Advanced hardware integrations
- Anonymous/guest user access (v2)