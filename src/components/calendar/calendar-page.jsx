import Link from "next/link";
import { Button } from "../ui/button";
import { Role, Scope } from "@prisma/client";
import CalendarTabs from "./calendar-tabs";

export default function CalendarPage({ user, slots }) {
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
      <CalendarTabs user={user} slots={slots} />
    </div>
  );
}
