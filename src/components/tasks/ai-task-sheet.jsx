"use client";

import { useActionState, useEffect, useState } from "react";
import { createTasksFromAi, getTasksFromAi } from "@/actions/tasks";
import AiTaskGenerateForm from "./ai-task-generate-form";
import TaskCreateForm from "./task-create-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { dateDisplay, timeDisplay } from "@/utils/calendar.util";

export default function AiTaskSheet({ slot, user }) {
  const [formStateAi, actionAi] = useActionState(getTasksFromAi, {
    errors: {},
    promptId: null,
    description: null,
    success: false,
    response: null,
    warning: null,
  });

  const [aiSuccess, setAiSuccess] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [recurringTasks, setRecurringTasks] = useState([]);

  useEffect(() => {
    setTasks(formStateAi.response?.tasks);
    setRecurringTasks(formStateAi.response?.recurringTasks);
    if (formStateAi.success) setAiSuccess(formStateAi.success);
  }, [formStateAi]);

  return (
    <Sheet
      onOpenChange={() => {
        if (aiSuccess) setAiSuccess(false);
      }}
    >
      <SheetTrigger className="hover:bg-neutral-500 text-white px-3 py-2 text-sm rounded-md bg-neutral-900 shadow-md">
        Add Summary
      </SheetTrigger>
      {!aiSuccess && (
        <SheetContent className="w-full">
          <SheetHeader className="my-5">
            <SheetTitle className="mx-auto">Describe the session</SheetTitle>
            <SheetDescription className="flex flex-col w-full space-y-2 bg-neutral-200 text-black p-2 rounded text-md mb-5">
              <span>
                Student: {slot.student.firstName} {slot.student.lastName}
              </span>
              <span>Date: {dateDisplay(slot.startTime)}</span>
              <span>
                Time:{" "}
                {timeDisplay({
                  hours: slot.startTime.getHours(),
                  minutes: slot.startTime.getMinutes(),
                })}{" "}
                -{" "}
                {timeDisplay({
                  hours: slot.endTime.getHours(),
                  minutes: slot.endTime.getMinutes(),
                })}
              </span>
            </SheetDescription>
          </SheetHeader>
          <AiTaskGenerateForm action={actionAi} />
        </SheetContent>
      )}
      {aiSuccess && (
        <SheetContent className="overflow-scroll">
          <SheetHeader>
            <SheetTitle className="my-3 mx-auto">Verify Details</SheetTitle>
            <SheetDescription>
              Please verify the details before confirming
            </SheetDescription>
          </SheetHeader>
          <div className="w-full text-sm">{formStateAi.description}</div>
          <TaskCreateForm
            slot={slot}
            user={user}
            promptId={formStateAi.promptId}
            warning={formStateAi.warning}
            tasks={tasks}
            setTasks={setTasks}
            recurringTasks={recurringTasks}
            setRecurringTasks={setRecurringTasks}
            summary={formStateAi.response?.summary}
            taskAction={createTasksFromAi}
          />
        </SheetContent>
      )}
    </Sheet>
  );
}
