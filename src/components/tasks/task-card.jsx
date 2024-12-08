"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "../ui/card";
import TaskStatusUpdateForm from "./task-status-update-form";
import { ChevronDown } from "lucide-react";
import { classNames } from "@/utils/task-status.utils";

export default function TaskCard({ task }) {
  const [open, setOpen] = useState(false);

  const taskStatusId = task.taskStatus?.id || null;
  const classNameItem = classNames.find(
    (item) => item.status === task.taskStatus?.status
  );

  return (
    <Card
      className={`w-full mt-5 ${
        !!classNameItem ? classNameItem.className : "bg-neutral-100"
      }`}
    >
      <CardHeader
        className="flex flex-row items-center justify-between cursor-pointer"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="flex flex-row items-center">
          <h3 className="text-xl font-bold">{task.title}</h3>
          <p className="ml-10 text-md">
            Assigned {task.student && "to "}
            {task.student && (
              <span className="font-bold">
                {task.student.firstName} {task.student.lastName}
              </span>
            )}
            {task.coach && "by "}
            {task.coach && (
              <span className="font-bold">
                {task.coach.firstName} {task.coach.lastName}
              </span>
            )}
          </p>
        </div>
        {open ? <ChevronDown size={24} /> : <ChevronDown size={24} />}
      </CardHeader>
      {open && (
        <CardContent className="flex flex-col w-full">
          <p className="my-3">{task.description}</p>
          {task.taskStatus && (
            <TaskStatusUpdateForm taskStatus={task.taskStatus} />
          )}
          {task.recurringTask && (
            <>
              <p>
                Repeat{" "}
                {task.recurringTask.frequency === 86400000
                  ? "Everyday"
                  : `every ${task.recurringTask.frequency / 86400000} days`}
              </p>
              <>
                <h3 className="text-lg font-bold mt-5">Status Log:</h3>
                {task.recurringTask.taskStatuses.map((taskStatus, index) => {
                  return (
                    <TaskStatusUpdateForm taskStatus={taskStatus} key={index} />
                  );
                })}
              </>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
