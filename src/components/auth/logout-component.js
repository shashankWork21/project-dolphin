"use client";
import { useEffect, useActionState } from "react";

import { logout } from "@/actions/auth";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { UserRound } from "lucide-react";
import Link from "next/link";

export default function LogoutComponent({ side, className }) {
  const { user, setUser } = useAuth();
  const [formState, action] = useActionState(logout, { success: false });
  const router = useRouter();
  useEffect(() => {
    if (formState.success) {
      setUser({});
      router.push("/");
    }
  }, [formState.success, setUser, router]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="bg-neutral-300 hover:bg-neutral-500 hover:text-neutral-50"
        >
          <UserRound size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent side={side} className={className}>
        <p className="text-center text-lg m3-5 mb-2">Hi {user?.firstName}</p>
        <div className="text-blue-500 mb-3 w-full text-center">
          <Link href="/dashboard">Go to Dashboard</Link>
        </div>
        <form action={action}>
          <Button
            type="submit"
            variant="secondary"
            className="bg-neutral-300 hover:bg-neutral-500 hover:text-neutral-50 w-full"
          >
            Logout
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
