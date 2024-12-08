"use client";

import { useActionState } from "react";
import { loginUser } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import Link from "next/link";

export default function LoginForm() {
  const googleSigninUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth?scope=EMAIL,PROFILE,OPENID&redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;
  const [formState, action] = useActionState(loginUser, {
    errors: {},
  });

  return (
    <div className="w-full flex flex-col">
      <div className="my-4 w-full text-center text-xl font-bold">Login</div>
      <div className="flex flex-col space-y-4 items-center px-2">
        <form action={action} className="flex flex-col space-y-3 w-full">
          <Input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full"
          />
          {!!formState.errors.email && (
            <ul className="text-red-600">
              {formState.errors.email?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full"
          />
          {!!formState.errors.password && (
            <ul className="text-red-600">
              {formState.errors.password?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Button type="submit">Login</Button>
        </form>
        <p>OR</p>
        <Link href={googleSigninUrl} className="w-full">
          <Button
            variant="secondary"
            className="w-full bg-white hover:bg-stone-300"
          >
            Login with Google
          </Button>
        </Link>
        {!!formState.errors._form && (
          <ul className="text-red-600">
            {formState.errors._form?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
