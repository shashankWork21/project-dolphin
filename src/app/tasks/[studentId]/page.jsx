import { validateSession } from "@/actions/auth";
import TaskList from "@/components/tasks/task-list";
import ProtectedRoute from "@/components/auth/protected-route";
import { getTasksByStudentAndCoach } from "@/db/queries/tasks";
import { getStudentById } from "@/db/queries/coach";

export default async function StudentTaskPage({ params }) {
  const { studentId } = await params;
  const { user } = await validateSession();
  const student = await getStudentById(studentId);

  const tasks = await getTasksByStudentAndCoach(studentId, user.id);

  return (
    <ProtectedRoute>
      <h1 className="text-2xl ml-10 mt-5 font-semibold mb-4">
        Client: {student.firstName} {student.lastName}
      </h1>
      <TaskList tasks={tasks} />
    </ProtectedRoute>
  );
}
