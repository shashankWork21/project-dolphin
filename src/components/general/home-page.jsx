"use client";

import { useActionState } from "react";
import { revokeTokens } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePageContent() {
  const [formState, action] = useActionState(revokeTokens, { success: false });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Card className="px-4 py-3 mt-10">
        <CardTitle className="my-2 text-center">Choose Role</CardTitle>
        <CardContent className="flex flex-row space-x-3 py-3">
          <Link href="/student/register">
            <Button variant="secondary" className="hover:bg-stone-300">
              Client
            </Button>
          </Link>
          <Link href="/coach/register">
            <Button variant="secondary" className="hover:bg-stone-300">
              Professional
            </Button>
          </Link>
        </CardContent>
        <CardContent className="flex flex-row space-x-3 py-3">
          <form action={action}>
            <Button variant="secondary" className="hover:bg-stone-300">
              Revoke all Tokens
            </Button>
          </form>
        </CardContent>
        {formState.success && (
          <CardContent className="bg-green-200 text-green-800 h-fit w-fit mx-auto px-auto">
            Success
          </CardContent>
        )}
      </Card>
    </div>
  );
}
