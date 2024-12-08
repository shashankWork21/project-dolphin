"use client";

import {
  deleteTaskStatusById,
  updateRecurringTaskStatus,
  updateTaskStatus,
} from "@/actions/tasks";
import { Role, TaskStatusTag } from "@prisma/client";
import { Fragment, useActionState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/context/auth-context";
import { classNames } from "@/utils/task-status.utils";
import TaskStatusBadge from "./task-status-badge";

export default function TaskStatusUpdateForm({ taskStatus }) {
  const { user } = useAuth();
  const recurringTaskId = taskStatus.recurringTask?.id || null;

  const classNameItem = classNames.find(
    (item) => item.status === taskStatus.status
  );

  const className = classNameItem?.className || "bg-neutral-700";
  const formBg = classNameItem?.formBg || "bg-white";

  const completeAction = recurringTaskId
    ? updateRecurringTaskStatus.bind(
        null,
        taskStatus.id,
        TaskStatusTag.COMPLETED,
        recurringTaskId
      )
    : updateTaskStatus.bind(null, taskStatus.id, TaskStatusTag.COMPLETED);

  const inProgressAction = recurringTaskId
    ? updateRecurringTaskStatus.bind(
        null,
        taskStatus.id,
        TaskStatusTag.IN_PROGRESS,
        recurringTaskId
      )
    : updateTaskStatus.bind(null, taskStatus.id, TaskStatusTag.IN_PROGRESS);
  const onHoldAction = recurringTaskId
    ? updateRecurringTaskStatus.bind(
        null,
        taskStatus.id,
        TaskStatusTag.ON_HOLD,
        recurringTaskId
      )
    : updateTaskStatus.bind(null, taskStatus.id, TaskStatusTag.ON_HOLD);
  const cancelledAction = recurringTaskId
    ? updateRecurringTaskStatus.bind(
        null,
        taskStatus.id,
        TaskStatusTag.CANCELLED,
        recurringTaskId
      )
    : updateTaskStatus.bind(null, taskStatus.id, TaskStatusTag.CANCELLED);

  const [formStateComplete, actionComplete] = useActionState(completeAction, {
    errors: {},
  });
  const [formStateInProgress, actionInProgress] = useActionState(
    inProgressAction,
    { errors: {} }
  );
  const [formStateOnHold, actionOnHold] = useActionState(onHoldAction, {
    errors: {},
  });
  const [formStateCancelled, actionCancelled] = useActionState(
    cancelledAction,
    { errors: {} }
  );

  const [formStateDelete, actionDelete] = useActionState(
    deleteTaskStatusById.bind(null, taskStatus.id),
    { errors: {} }
  );

  return (
    <>
      <div
        className={`flex flex-row justify-between items-center mt-6 py-2 px-6 rounded-lg ${
          recurringTaskId !== null ? className : ""
        }`}
      >
        <TaskStatusBadge taskStatus={taskStatus} />
        <div
          className={`flex gap-4 itmes-center px-6 py-3 rounded-lg ${formBg}`}
        >
          {user?.role === Role.STUDENT && (
            <Fragment>
              <form action={actionInProgress}>
                <Button
                  type="submit"
                  className="bg-yellow-300 text-black hover:bg-yellow-500 text-sm"
                >
                  In Progress
                </Button>
              </form>
              <form action={actionOnHold}>
                <Button
                  type="submit"
                  className="bg-red-700 hover:bg-red-900 text-sm"
                >
                  On Hold
                </Button>
              </form>
              <form action={actionComplete}>
                <Button type="submit" className="bg-green-700 text-sm">
                  Complete
                </Button>
              </form>
            </Fragment>
          )}
          {user?.role === Role.COACH && (
            <Fragment>
              <form action={actionCancelled}>
                <Button
                  type="submit"
                  variant="outline"
                  className="text-sm text-black"
                >
                  Cancel
                </Button>
              </form>
              <form action={actionDelete}>
                <Button type="submit" variant="destructive">
                  Delete
                </Button>
              </form>
            </Fragment>
          )}
        </div>
      </div>
    </>
  );
}
