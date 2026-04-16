import { Link } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold">GMJK Lockers</h1>
        <p className="text-slate-600 mt-2">
          Lockers, rentals, and analytics in one place.
        </p>

        <div className="mt-8 flex gap-3">
          <SignedOut>
            <SignInButton mode="redirect">
              <button className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-medium">
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="redirect">
              <button className="px-5 py-3 rounded-xl border border-slate-300 font-medium">
                Create account
              </button>
            </SignUpButton>
          </SignedOut>

          <SignedIn>
            <Link
              to="/lockers"
              className="px-5 py-3 rounded-xl bg-slate-900 text-white font-medium"
            >
              Go to dashboard
            </Link>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}