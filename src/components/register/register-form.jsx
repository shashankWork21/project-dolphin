"use client";
import { useActionState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Card, CardContent, CardTitle } from "../ui/card";
import { createUserWithPassword } from "@/actions/auth";
import { useAuth } from "@/context/auth-context";
import { useRouter } from "next/navigation";

export default function RegisterForm({ role }) {
  const router = useRouter();
  const { user } = useAuth();
  const [formState, action] = useActionState(
    createUserWithPassword.bind(null, role),
    {
      errors: {},
      success: false,
    }
  );

  useEffect(() => {
    let route, location;
    if (formState?.success) {
      location =
        role === "coach"
          ? `${process.env.NEXT_PUBLIC_BASE_URL}/coach/details`
          : `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`;
    } else if (user) {
      route = "/dashboard";
    }
    if (route) {
      router.push(route);
    } else if (location) {
      window.location.href = location;
    }
  }, [user, router, formState?.success, role]);

  return (
    <Card className="w-9/10 md:w-3/5 lg:w-1/4 mx-auto mt-10 px-5 py-2 flex flex-col bg-stone-100 border-none">
      <CardTitle className="mb-4 w-full text-center text-xl">
        Register
      </CardTitle>
      <CardContent className="flex flex-col space-y-6">
        <form action={action} className="flex flex-col space-y-6">
          <Input type="text" name="firstName" placeholder="First Name" />
          {!!formState?.errors?.firstName && (
            <ul className="text-red-600">
              {formState?.errors?.firstName?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Input type="text" name="lastName" placeholder="Last Name" />{" "}
          {!!formState?.errors?.lastName && (
            <ul className="text-red-600">
              {formState?.errors?.lastName?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Input type="email" name="email" placeholder="Email" />
          {!!formState?.errors?.email && (
            <ul className="text-red-600">
              {formState?.errors?.email?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Input
            type="password"
            name="password"
            placeholder="Choose a Password"
          />
          {!!formState?.errors?.password && (
            <ul className="text-red-600">
              {formState?.errors?.password?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
          />
          {!!formState?.errors?.confirmPassowrd && (
            <ul className="text-red-600">
              {formState?.errors?.confirmPassowrd?.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          )}
          <Button type="submit">Register</Button>
        </form>
        {!!formState?.errors?._form && (
          <ul className="text-red-600">
            {formState?.errors?._form?.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
