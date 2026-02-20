import { SignIn, SignUp } from "@clerk/clerk-react";
import { useLocation } from "react-router-dom";

export function SignInPage() {
  const location = useLocation();
  const redirectUrl = location.state?.from || "/lockers";

  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-6">
      <SignIn signUpUrl="/sign-up" afterSignInUrl={redirectUrl} />
    </div>
  );
}

export function SignUpPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-slate-100 p-6">
      <SignUp signInUrl="/sign-in" afterSignUpUrl="/lockers" />
    </div>
  );
}