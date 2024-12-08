"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function HomePageContent() {
  return (
    <div className="sm:p-20 flex flex-col items-center justify-center font-sans">
      <header className="mb-12 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4">
          Welcome to Dolphin
        </h1>
        <p className="text-lg sm:text-xl">
          Track your sessions, tasks, and progress effortlessly
        </p>
      </header>
      <div className="min-h-screen w-full max-w-md">
        <Card className="px-6 pt-6 pb-2 text-black rounded-lg shadow-lg bg-neutral-200">
          <CardTitle className="text-2xl font-semibold text-center mb-4">
            Choose Your Role
          </CardTitle>
          <CardContent className="flex flex-col md:flex-row space-y-4 md:space-x-4 md:space-y-0 items-center justify-center">
            <Link href="/student/register">
              <Button
                variant="secondary"
                className="w-full py-3 text-lg bg-blue-700 hover:bg-blue-500 text-white rounded-lg"
              >
                Client
              </Button>
            </Link>
            <Link href="/coach/register">
              <Button
                variant="secondary"
                className="w-full py-3 text-lg bg-green-700 hover:bg-green-500 text-white rounded-lg"
              >
                Professional
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-12 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Dolphin. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
