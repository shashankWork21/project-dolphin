"use client";

import { toTitleCase } from "@/utils/string.utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Badge } from "../ui/badge";
import { useAuth } from "@/context/auth-context";
import { classNames } from "@/utils/task-status.utils";
import { Fragment } from "react";
import TaskStatusBadge from "./task-status-badge";

export default function TaskAccordion({ task }) {
  const { user } = useAuth();

  return (
    <AccordionItem value={task.id}>
      <AccordionTrigger>
        <div className="flex flex-row gap-3">
          {task.title}
          {task.recurringTask && (
            <Badge>
              {task.recurringTask.frequency === 86400000
                ? "Everyday"
                : `Every ${Math.floor(
                    task.recurringTask.frequency / 86400000
                  )} days`}
            </Badge>
          )}
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col w-full space-y-3">
          <p>{task.description}</p>
          {task.taskStatus && <TaskStatusBadge taskStatus={task.taskStatus} />}
          {task.recurringTask &&
            task.recurringTask.taskStatuses.map((taskStatus) => {
              return (
                <Fragment key={taskStatus.id}>
                  <TaskStatusBadge taskStatus={taskStatus} />
                </Fragment>
              );
            })}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
