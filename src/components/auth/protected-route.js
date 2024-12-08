"use client";

import { useAuth } from "@/context/auth-context";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../ui/app-sidebar";
import { coachItems, studentItems } from "@/utils/sidebar-menu";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let redirectTimeout;

    if (!loading) {
      if (!user) {
        redirectTimeout = setTimeout(() => {
          router.push("/");
        }, 100);
      } else {
        clearTimeout(redirectTimeout);
      }
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [user, loading, router, pathname]);

  const items = user?.role === "COACH" ? coachItems : studentItems;

  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar items={items} />
      <SidebarTrigger />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
