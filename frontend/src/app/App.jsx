import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layout/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/dashboard/Dashboard";
import Lockers from "../features/lockers/pages/Lockers";
import Rentals from "../features/rentals/pages/Rentals";
import Notifications from "../features/notifications/Notifications";
import Analytics from "../features/analytics/Analytics";
import StaffDashboard from "../features/staff/pages/StaffDashboard";
import UserManagement from "../features/users/pages/UserManagement";
import FacilitySettings from "../features/settings/pages/FacilitySettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lockers" element={<Lockers />} />
            <Route path="/rentals" element={<Rentals />} />
            <Route path="/notifications" element={<Notifications />} />

            {/* Staff + Owner */}
            <Route
              element={<ProtectedRoute allowedRoles={["STAFF", "OWNER"]} />}
            >
              <Route path="/staff" element={<StaffDashboard />} />
            </Route>

            {/* Owner only */}
            <Route element={<ProtectedRoute allowedRoles={["OWNER"]} />}>
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/users" element={<UserManagement />} />
              <Route path="/settings" element={<FacilitySettings />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
