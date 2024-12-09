import TaskCard from "./task-card";

export default function TaskList({ tasks }) {
  return (
    <div className="flex flex-col container items-center mx-auto">
      {tasks.length > 0 &&
        tasks.map((task) => <TaskCard key={task.id} task={task} />)}
      {tasks.length === 0 && (
        <div className="px-20 py-10 text-3xl bg-neutral-200 text-neutral-500 w-fit font-bold mt-10">
          There are no tasks to show
        </div>
      )}
    </div>
  );
}
