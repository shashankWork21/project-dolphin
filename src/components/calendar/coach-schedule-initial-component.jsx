"use client";
import { useState } from "react";
import CoachScheduleForm from "./coach-schedule-form";

export default function CoachScheduleInitialComponent() {
  const { user } = useAuth();
  const [edit, setEdit] = useState(false);
  const now = new Date();
  return (
    <CoachScheduleForm
      user={user}
      formAction={createSchedule}
      setEdit={setEdit}
      defaultValues={{
        daysOfWeek: [],
        slotLength: 0,
        startTime: now,
        endTime: new Date(now.getTime() + 9 * 3600 * 1000),
        holidays: [],
      }}
      buttonText="Create Schedule"
      showCancel={false}
    />
  );
}
