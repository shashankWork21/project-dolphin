import { validateSession } from "@/actions/auth";
import TaskList from "@/components/tasks/task-list";
import ProtectedRoute from "@/components/auth/protected-route";
import { getTasksByStudentAndCoach } from "@/db/queries/tasks";

export default async function StudentTaskPage() {
  const { studentId } = await params;
  const { user } = await validateSession();

  const tasks = await getTasksByStudentAndCoach(studentId, user.id);

  return (
    <ProtectedRoute>
      <TaskList tasks={tasks} />
    </ProtectedRoute>
  );
}
