import { validateSession } from "@/actions/auth";
import { getAllPrompts } from "@/actions/tasks";
import ProtectedRoute from "@/components/auth/protected-route";
import CoachSchedulePage from "@/components/calendar/schedule-page";
import { getCoachById } from "@/db/queries/coach";

export default async function PostPage({ params }) {
  const { coachId } = await params;
  const coach = await getCoachById(coachId);
  return (
    <ProtectedRoute>
      <CoachSchedulePage coach={coach} />
    </ProtectedRoute>
  );
}
