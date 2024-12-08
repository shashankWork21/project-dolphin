import Link from "next/link";
import { Button } from "../ui/button";
import { Role, Scope } from "@prisma/client";
import CalendarTabs from "./calendar-tabs";

export default function CalendarPage({ user, slots, message }) {
  const googleSigninUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth?scope=CALENDAR&role=coach&redirect_url=${process.env.NEXT_PUBLIC_BASE_URL}/calendar&user_id=${user.id}`;
  const calendarToken = user.tokens.find((token) =>
    token.scopes.includes(Scope.CALENDAR)
  );
  return (
    <div className="h-full w-full flex flex-col space-y-5 py-5">
      {!calendarToken && user.role === Role.COACH && (
        <div className="w-full py-5 flex justify-center">
          <Link href={googleSigninUrl}>
            <Button>Connect Calendar</Button>
          </Link>
        </div>
      )}
      {message && (
        <p
          className={`w-fit px-2 py-1 mx-auto ${
            message.success
              ? "bg-green-100 text-green-600"
              : "bg-red-100 text-red-600"
          }`}
        >
          {message.message}
        </p>
      )}
      <CalendarTabs user={user} slots={slots} />
    </div>
  );
}
