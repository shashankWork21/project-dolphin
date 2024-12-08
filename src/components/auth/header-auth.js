"use client";

import { useAuth } from "@/context/auth-context";
import LoginComponent from "./login-component";
import LogoutComponent from "./logout-component";

export default function HeaderAuth() {
  const { user, loading } = useAuth();
  const authContent = user?.email ? (
    <LogoutComponent side="left" className="mt-5 bg-neutral-100" />
  ) : (
    <LoginComponent side="left" className="mt-5 bg-neutral-100" />
  );

  if (loading) {
    return;
  }
  return authContent;
}
