import { validateSession } from "@/actions/auth";
import { addExistingEventsToCalendar, completeSlots } from "@/actions/slot";
import { getAllPrompts } from "@/actions/tasks";
import ProtectedRoute from "@/components/auth/protected-route";
import CalendarPageComponent from "@/components/calendar/calendar-page";
import { getSlotsByCoach, getSlotsByStudent } from "@/db/queries/slot";
import { Role } from "@prisma/client";

export default async function CalendarPage() {
  const { user } = await validateSession();

  await completeSlots(user);

  const isCoach = user.role === Role.COACH;

  const slots = isCoach
    ? await getSlotsByCoach(user.id)
    : await getSlotsByStudent(user.id);

  let message = null;
  if (isCoach) {
    message = await addExistingEventsToCalendar();
  }

  return (
    <ProtectedRoute>
      <div className="text-wrap w-full">
        <CalendarPageComponent user={user} slots={slots} message={message} />
      </div>
    </ProtectedRoute>
  );
}
