"use client";

import { createSchedule } from "@/actions/schedule";
import CoachScheduleForm from "./coach-schedule-form";
import { useState } from "react";
import CoachScheduleCard from "./coach-schedule-card";

export default function CoachSchedule({ user }) {
  const [edit, setEdit] = useState(false);
  const now = new Date();
  return !user.schedule?.id ? (
    <CoachScheduleForm
      user={user}
      formAction={createSchedule}
      setEdit={setEdit}
      defaultValues={{
        daysOfWeek: [],
        slotLength: 0,
        startTime: null,
        endTime: null,
        holidays: [],
      }}
      buttonText="Create Schedule"
      showCancel={false}
    />
  ) : (
    <CoachScheduleCard user={user} setEdit={setEdit} edit={edit} />
  );
}
