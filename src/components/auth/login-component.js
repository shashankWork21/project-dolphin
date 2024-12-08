"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import LoginForm from "../register/login-form";

export default function LoginComponent({ side, className }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="bg-neutral-300 hover:bg-neutral-500 hover:text-neutral-50"
        >
          Login
        </Button>
      </PopoverTrigger>
      <PopoverContent side={side} className={className}>
        <LoginForm />
      </PopoverContent>
    </Popover>
  );
}
