import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

import Register from "../features/auth/pages/Register";
import Login from "../features/auth/pages/Login";
import DashboardLayout from "./layout/DashboardLayout";
import Lockers from "../features/lockers/pages/Lockers";
import Rentals from "../features/rentals/pages/Rentals";
import Analytics from "../features/analytics/Analytics";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        {user ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Lockers />} />
            <Route path="/rentals" element={<Rentals />} />
            {user.role === "OWNER" && (
              <Route path="/analytics" element={<Analytics />} />
            )}
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

