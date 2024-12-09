import { validateSession } from "@/actions/auth";
import ProtectedRoute from "@/components/auth/protected-route";
import DashboardPage from "@/components/general/dashboard-page";
import { getTasksByCoach, getTasksByStudent } from "@/db/queries/tasks";
import { Role } from "@prisma/client";

export default async function Dashboard() {
  const { user } = await validateSession();

  const { role } = user;

  const tasks =
    role === Role.COACH
      ? await getTasksByCoach(user.id)
      : await getTasksByStudent(user.id);

  return (
    <ProtectedRoute>
      <DashboardPage user={user} tasks={tasks} />
    </ProtectedRoute>
  );
}
