"use client";

import { UserProvider } from "@/context/auth-context";

export default function Providers({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
