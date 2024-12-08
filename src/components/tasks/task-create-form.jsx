"use client";

import { useActionState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

export default function TaskCreateForm({
  slot,
  user,
  promptId,
  warning,
  tasks,
  summary,
  setTasks,
  recurringTasks,
  setRecurringTasks,
  taskAction,
}) {
  const [formState, action] = useActionState(
    taskAction.bind(null, {
      slotId: slot.id,
      studentId: slot.studentId,
      coachId: user.id,
      promptId,
      summary,
    }),
    { errors: {}, success: false }
  );

  return (
    <form className="my-3 flex flex-col items-center" action={action}>
      <div className="my-3 w-full flex flex-col items-center">
        {!!warning && (
          <div className="p-3 bg-yellow-300 text-yellow-700 text-sm mb-5 rounded-lg">
            {warning}
          </div>
        )}
        <div className="flex flex-row items-center justify-between w-full">
          <h2 className="text-xl font-bold mb-4">Tasks</h2>
          <div
            className="bg-neutral-900 text-white mb-5 px-5 py-2 cursor-pointer rounded-lg"
            onClick={() => {
              setTasks([...tasks, { title: "", description: "" }]);
            }}
          >
            <Plus size={12} />
          </div>
        </div>

        {tasks?.length > 0 &&
          tasks?.map((task, index) => {
            return (
              <div
                key={index}
                className="bg-neutral-200 px-4 py-3 rounded-lg shadow-lg w-full mt-3"
              >
                <div className="w-full flex flex-row justify-end">
                  <X
                    size={12}
                    className="cursor-pointer"
                    onClick={() => {
                      setTasks(tasks.filter((t, i) => i !== index)) || [];
                    }}
                  />
                </div>
                <Input
                  className="my-2 border border-neutral-500"
                  name={`task-title`}
                  defaultValue={task.title}
                />
                <Textarea
                  className="my-2 border border-neutral-500"
                  name={`task-description`}
                  defaultValue={task.description}
                  rows={3}
                />
              </div>
            );
          })}
      </div>

      <div className="my-3 w-full flex flex-col items-center">
        <div className="flex flex-row items-center justify-between w-full">
          <h2 className="text-xl font-bold mb-4">Repeating Tasks</h2>
          <div
            className="bg-neutral-900 text-white mb-5 px-5 py-2 cursor-pointer rounded-lg"
            onClick={() => {
              setRecurringTasks([
                ...recurringTasks,
                { title: "", description: "", frequency: 86400000 },
              ]);
            }}
          >
            <Plus size={12} />
          </div>
        </div>
        {recurringTasks?.length > 0 &&
          recurringTasks?.map((task, index) => {
            return (
              <div
                key={index}
                className="bg-neutral-200 px-4 py-3 rounded-lg shadow-lg w-full mb-3"
              >
                <div className="w-full flex flex-row justify-end">
                  <X
                    className="cursor-pointer"
                    size={12}
                    onClick={() => {
                      setRecurringTasks(
                        recurringTasks.filter((t, i) => i !== index) || []
                      );
                    }}
                  />
                </div>
                <Input
                  className="mt-2 border border-neutral-500"
                  name={`recurring-task-title`}
                  defaultValue={task.title}
                />

                <Textarea
                  className="mt-2 border border-neutral-500"
                  name={`recurring-task-description`}
                  defaultValue={task.description}
                  rows={3}
                />
                <div className="flex flex-row gap-2 mt-2 w-fit items-center">
                  <p>Repeat every</p>
                  <Input
                    type="number"
                    className="w-1/6 border border-neutral-500 text-center"
                    name={`recurring-task-frequency`}
                    defaultValue={`${task.frequency / 86400000}`}
                  />
                  <p>days</p>
                </div>
              </div>
            );
          })}
      </div>

      <Button type="submit" className="w-1/2 mt-4">
        Confirm
      </Button>
      {formState.success && (
        <div className="px-8 py-3 bg-green-100 text-green-800 font-bold">
          Tasks Created Successfully
        </div>
      )}
      {!!formState.errors._form && (
        <ul className="text-red-600">
          {formState.errors._form?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </form>
  );
}
