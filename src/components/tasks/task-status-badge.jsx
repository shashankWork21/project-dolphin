import { classNames } from "@/utils/task-status.utils";
import { Badge } from "../ui/badge";
import { toTitleCase } from "@/utils/string.utils";
import { dateDisplay } from "@/utils/calendar.util";

export default function TaskStatusBadge({ taskStatus }) {
  const recurringTaskId = taskStatus.recurringTask?.id || null;
  const classNameItem = classNames.find(
    (item) => item.status === taskStatus.status
  );

  const className = classNameItem?.className || "bg-neutral-700";
  return (
    <div
      className={`flex flex-row items-center justify-start gap-32 ${
        recurringTaskId !== null ? className : ""
      }`}
    >
      <p>
        Date:{" "}
        <span className="font-bold">{dateDisplay(taskStatus.taskDate)}</span>
      </p>
      <div className="flex flex-row items-center justify-start gap-2">
        <p>Status:</p>
        <p>{toTitleCase(taskStatus.status.split("_").join(" "))}</p>
      </div>
    </div>
  );
}
