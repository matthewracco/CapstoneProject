# GMJK Lockers - Testing Guide

## Quick Setup (2 minutes)

```bash
# 1. Pull the branch
git checkout Gurnoor
git pull origin Gurnoor

# 2. Install backend dependencies
cd backend
npm install
npx prisma generate

# 3. Create .env file in /backend
# (copy paste this exactly)
PORT=5050
BYPASS_AUTH=false
DEV_USER_ID=user_demo_1
DEV_TENANT_ID=tenant_demo_1

# 4. Set up database with seed data
npx prisma migrate deploy
node prisma/seed.js

# 5. Start backend (keep this terminal open)
node server.js

# 6. In a NEW terminal - install and start frontend
cd frontend
npm install
npm run dev

# 7. Open http://localhost:5173
```

---

## Demo Accounts

| Role     | Email                      | Password      | What they can do                          |
|----------|---------------------------|---------------|-------------------------------------------|
| Customer | customer@smartlocker.com  | password123   | Rent lockers, pay, get access codes       |
| Customer | john@smartlocker.com      | password123   | Same as above (second customer)           |
| Staff    | staff@smartlocker.com     | password123   | Everything above + manage lockers/rentals |
| Owner    | owner@smartlocker.com     | password123   | Everything above + analytics + user mgmt  |

---

## Test as CUSTOMER (customer@smartlocker.com)

### What you should see:
- Sidebar: Dashboard, Lockers, Rentals, Notifications (4 items only)
- Dashboard: Personal greeting "Welcome back, Demo" with 2 stat cards + quick action links
- NO "Add Locker" button on the Lockers page
- NO Staff, Analytics, or Users pages

### Test flow:
1. **Login** with customer@smartlocker.com / password123
2. **Dashboard** - should say "Welcome back, Demo" with personal stats
3. **Lockers** - browse lockers, click "Rent This Locker" on any available one
4. **Confirm Rental** - see price, click Confirm -> get rental code
5. **My Rentals** - see your active rental with 4 buttons:
   - **Get Access Code** - generates a 6-digit code with 5-min countdown
   - **Extend** - add +1hr, +2hr, or +4hr to rental
   - **Pay Now** - choose Credit Card or Digital Wallet, click Pay
   - **End Rental** - completes the rental, locker becomes available
6. **Notifications** - check the bell icon (should show unread count), click to see notification list

---

## Test as STAFF (staff@smartlocker.com)

### What you should see:
- Sidebar: Dashboard, Lockers, Rentals, Notifications, **Staff** (5 items)
- Sidebar shows **"STAFF PANEL"** badge under GMJK Lockers logo
- Dashboard: Full management view with 4 stat cards, utilization charts
- "Add Locker" button visible on Lockers page

### Test flow:
1. **Login** with staff@smartlocker.com / password123
2. **Dashboard** - full management view (Total Lockers, Active Rentals, Revenue, Total Rentals)
3. **Staff Dashboard** - 3 tabs:
   - **All Lockers** - see all 24 lockers with status, click to set Available/Maintenance
   - **Active Rentals** - see ALL users' rentals, click "Force End" on any active one
   - **Users** - view all registered users and their roles
4. **Lockers** - "Add Locker" button should be visible (can create new lockers)

---

## Test as OWNER (owner@smartlocker.com)

### What you should see:
- Sidebar: Dashboard, Lockers, Rentals, Notifications, Staff, **Analytics**, **Users** (7 items)
- Sidebar shows **"ADMIN PANEL"** badge
- Has access to everything Staff has, PLUS:

### Test flow:
1. **Login** with owner@smartlocker.com / password123
2. **Analytics** - pie chart (locker status), bar chart (lockers by size), revenue, utilization rate
3. **Users** - search users, filter by role, change someone's role (e.g. CUSTOMER -> STAFF), delete users
4. **Staff Dashboard** - same access as Staff (override lockers, force-end rentals)

---

## Key Features to Demo

| Feature              | How to test it                                    |
|---------------------|---------------------------------------------------|
| JWT Authentication  | Login/logout, try accessing /staff as customer     |
| Role-Based UI       | Compare sidebar + dashboard between 3 accounts    |
| Rent a Locker       | Customer: Lockers -> Rent -> Confirm               |
| Access Code         | After renting: My Rentals -> Get Access Code       |
| Payment             | After renting: My Rentals -> Pay Now -> Credit Card |
| Extend Rental       | After renting: My Rentals -> Extend -> +1hr        |
| End Rental          | My Rentals -> End Rental                           |
| Notifications       | Bell icon in top bar shows unread count            |
| Staff Override      | Staff: Staff Dashboard -> Set locker to Maintenance|
| Force End Rental    | Staff: Staff Dashboard -> Active Rentals -> Force End |
| User Management     | Owner: Users page -> Change role / Delete user     |
| Analytics           | Owner: Analytics page -> Charts + stats            |

---

## Troubleshooting

- **"Unauthorized" errors**: Make sure BYPASS_AUTH=false in .env and restart backend
- **"Cannot find module"**: Run `npm install` in both /backend and /frontend
- **Database errors**: Run `npx prisma migrate deploy && node prisma/seed.js` in /backend
- **Port in use**: Kill any existing node processes: `taskkill /f /im node.exe` (Windows)
- **Frontend won't load**: Make sure backend is running on port 5050 first
