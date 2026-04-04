import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useAuth } from "../../features/auth/useAuth";

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
