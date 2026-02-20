import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-slate-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}