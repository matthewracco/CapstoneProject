# GMJK Lockers - Locker Rental Management System

A full-stack web application for managing locker rentals. Customers can browse, rent, and manage lockers with real-time access codes and payments. Staff and owners get management dashboards with analytics, user management, and facility oversight.

**George Brown College - Capstone Project (Winter 2026)**

**Team:** Gurnoor Singh, Matthew Racco, Koorosh Farvardin, Kien Vu Tran

---

## Tech Stack

| Layer      | Technology                                      |
|------------|------------------------------------------------|
| Frontend   | React 19, Vite, Tailwind CSS, React Router     |
| Backend    | Node.js, Express.js                             |
| Database   | SQLite (dev) via Prisma ORM                     |
| Auth       | JWT (bcrypt + jsonwebtoken)                     |
| Charts     | Recharts                                        |
| Icons      | Lucide React                                    |

---

## Features

### Customer Features
- Browse and rent available lockers (Small, Medium, Large)
- Generate 6-digit access codes with 5-minute expiry
- Make payments (Credit Card / Digital Wallet)
- Extend rental duration (+1hr, +2hr, +4hr)
- End rentals and view rental history
- Real-time notifications (bell icon with unread count)

### Staff Features
- Full management dashboard with facility stats
- View and manage all lockers (set Available/Maintenance)
- View all active rentals across all users
- Force-end any active rental
- Add new lockers to the system

### Owner Features
- Everything Staff can do, plus:
- Analytics dashboard with pie charts and bar charts
- Revenue tracking and utilization metrics
- User management (search, filter by role, change roles, delete users)

### Role-Based UI
- **Customer** sees: Dashboard (personal), Lockers, Rentals, Notifications
- **Staff** sees: Everything above + Staff Dashboard (with "STAFF PANEL" badge)
- **Owner** sees: Everything above + Analytics + Users (with "ADMIN PANEL" badge)

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm

### 1. Clone the repository

```bash
git clone https://github.com/matthewracco/CapstoneProject.git
cd CapstoneProject
```

### 2. Setup Backend

```bash
cd backend
npm install
npx prisma generate
```

Create a `.env` file in `/backend`:

```env
PORT=5050
BYPASS_AUTH=false
DEV_USER_ID=user_demo_1
DEV_TENANT_ID=tenant_demo_1
```

Setup the database with seed data:

```bash
npx prisma migrate deploy
node prisma/seed.js
```

Start the backend server:

```bash
node server.js
```

> Backend runs on http://localhost:5050

### 3. Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs on http://localhost:5173

### 4. Open the app

Go to **http://localhost:5173** in your browser.

---

## Demo Accounts

| Role     | Email                      | Password      | Access Level                              |
|----------|---------------------------|---------------|-------------------------------------------|
| Customer | customer@smartlocker.com  | password123   | Rent lockers, pay, get access codes       |
| Customer | john@smartlocker.com      | password123   | Same as above (second customer)           |
| Staff    | staff@smartlocker.com     | password123   | Everything above + manage lockers/rentals |
| Owner    | owner@smartlocker.com     | password123   | Everything above + analytics + user mgmt  |

---

## Screenshots

### Login Page
Clean authentication page with email/password login and account registration.

![Login Page](docs/screenshots/login.png)

### Customer Dashboard
Personal dashboard with active rentals count, available lockers, quick actions, and recent activity.

![Customer Dashboard](docs/screenshots/customer-dashboard.png)

### Lockers Page
Browse all lockers with status filter tabs (All, Available, Occupied, Maintenance). Customers see "Rent This Locker" buttons.

![Lockers Page](docs/screenshots/lockers.png)

### My Rentals
View all your rentals with status badges, rental codes, timestamps, and costs.

![Rentals Page](docs/screenshots/rentals.png)

### Owner Dashboard
Full management dashboard with Total Lockers, Active Rentals, Revenue, Total Rentals stats, plus Locker Status and Lockers by Size breakdowns.

![Owner Dashboard](docs/screenshots/owner-dashboard.png)

### Analytics (Owner Only)
Utilization rate, revenue tracking, pie chart for locker status distribution, bar chart for lockers by size.

![Analytics Page](docs/screenshots/analytics.png)

### Staff Dashboard
Manage all lockers, view active rentals across all users, force-end rentals, and manage users.

![Staff Dashboard](docs/screenshots/staff-dashboard.png)

---

## Project Structure

```
CapstoneProject/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   ├── seed.js                # Demo data seeder
│   │   └── migrations/            # Database migrations
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── middleware/
│   │   │   ├── clerkTenant.js     # Auth middleware (JWT)
│   │   │   └── rbac.js            # Role-based access control
│   │   ├── routes/
│   │   │   ├── auth.routes.js     # Login / Register
│   │   │   ├── locker.routes.js   # CRUD lockers
│   │   │   ├── rental.routes.js   # Rent / Extend / End
│   │   │   ├── payment.routes.js  # Process payments
│   │   │   ├── notification.routes.js
│   │   │   ├── stats.routes.js    # Dashboard stats
│   │   │   └── user.routes.js     # User management
│   │   ├── services/
│   │   │   ├── auth.service.js
│   │   │   ├── rental.service.js
│   │   │   ├── payment.service.js
│   │   │   ├── accessCode.service.js
│   │   │   ├── notification.service.js
│   │   │   ├── qr.service.js
│   │   │   └── user.service.js
│   │   └── jobs/
│   │       └── expiryChecker.js   # Cron: expiry warnings + auto-complete
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── App.jsx            # Router + auth provider
│   │   │   ├── components/
│   │   │   │   └── ProtectedRoute.jsx
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx    # Role-based navigation
│   │   │       ├── Topbar.jsx     # Notification bell + user info
│   │   │       └── DashboardLayout.jsx
│   │   ├── features/
│   │   │   ├── auth/              # Login, Register, AuthContext
│   │   │   ├── dashboard/         # Role-based dashboards
│   │   │   ├── lockers/           # Browse, Rent, Create, Access Codes
│   │   │   ├── rentals/           # My Rentals, Pay, Extend
│   │   │   ├── notifications/     # Bell icon + notification list
│   │   │   ├── staff/             # Staff management dashboard
│   │   │   ├── analytics/         # Charts + utilization stats
│   │   │   └── users/             # User management (Owner)
│   │   └── lib/
│   │       └── axios.js           # API client with JWT interceptors
│   ├── vite.config.js
│   └── package.json
│
├── TESTING-GUIDE.md               # Detailed testing instructions
└── README.md
```

---

## API Endpoints

| Method | Endpoint               | Auth  | Description                    |
|--------|------------------------|-------|--------------------------------|
| POST   | /api/v1/auth/register  | No    | Create new account             |
| POST   | /api/v1/auth/login     | No    | Login, returns JWT tokens      |
| POST   | /api/v1/auth/refresh   | No    | Refresh access token           |
| GET    | /api/v1/lockers        | Yes   | List all lockers               |
| POST   | /api/v1/lockers        | Staff | Create a new locker            |
| PATCH  | /api/v1/lockers/:id    | Staff | Update locker status           |
| GET    | /api/v1/rentals        | Yes   | Get rentals (own or all)       |
| POST   | /api/v1/rentals        | Yes   | Create a new rental            |
| PATCH  | /api/v1/rentals/:id    | Yes   | Extend or end a rental         |
| POST   | /api/v1/payments       | Yes   | Process a payment              |
| POST   | /api/v1/rentals/:id/access-code | Yes | Generate access code  |
| GET    | /api/v1/notifications  | Yes   | Get user notifications         |
| PATCH  | /api/v1/notifications/:id | Yes | Mark notification as read    |
| GET    | /api/v1/stats          | Yes   | Dashboard statistics           |
| GET    | /api/v1/users          | Owner | List all users                 |
| PATCH  | /api/v1/users/:id/role | Owner | Change user role               |
| DELETE | /api/v1/users/:id      | Owner | Delete a user                  |

---

## Troubleshooting

| Issue                    | Fix                                                        |
|--------------------------|-----------------------------------------------------------|
| "Unauthorized" errors    | Make sure `BYPASS_AUTH=false` in `.env`, restart backend   |
| "Cannot find module"     | Run `npm install` in both `/backend` and `/frontend`      |
| Database errors          | Run `npx prisma migrate deploy && node prisma/seed.js`    |
| Port already in use      | Kill node processes: `taskkill /f /im node.exe` (Windows) |
| Frontend won't load      | Make sure backend is running on port 5050 first           |
| Prisma generate fails    | Kill all node processes first, then run `npx prisma generate` |

---

## License

This project was built as a capstone project for George Brown College, Winter 2026.
