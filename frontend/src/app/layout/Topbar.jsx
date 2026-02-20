import { useUser, SignOutButton } from "@clerk/clerk-react";

export default function Topbar() {
  const { user } = useUser();

  return (
    <div className="h-16 bg-white shadow-sm flex items-center justify-between px-8">
      <h1 className="font-semibold text-lg">Smart Locker Dashboard</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-600">
          {user?.publicMetadata?.role ?? "USER"}
        </span>

        <SignOutButton>
          <button className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm">
            Logout
          </button>
        </SignOutButton>
      </div>
    </div>
  );
}