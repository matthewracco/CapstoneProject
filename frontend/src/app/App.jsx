import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/clerk-react";

import Home from "./pages/Home";
import DashboardLayout from "./layout/DashboardLayout";

import Lockers from "../features/lockers/pages/Lockers";
import Rentals from "../features/rentals/pages/Rentals";
import Analytics from "../features/analytics/Analytics";

import { SignInPage, SignUpPage } from "./pages/Auth";

// ✅ Owner guard (route-level protection)
function RequireOwner({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  const role = (user?.publicMetadata?.role || "USER").toString().toUpperCase();

  if (role !== "OWNER") {
    return <Navigate to="/lockers" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />

        <Route
          element={
            <>
              <SignedIn>
                <DashboardLayout />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        >
          <Route path="/lockers" element={<Lockers />} />
          <Route path="/rentals" element={<Rentals />} />
          <Route
            path="/analytics"
            element={
              <RequireOwner>
                <Analytics />
              </RequireOwner>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}