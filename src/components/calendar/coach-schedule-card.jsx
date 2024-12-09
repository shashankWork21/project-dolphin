"use client";

import { Card, CardHeader, CardContent } from "../ui/card";
import { dateDisplay, daysOfWeek, timeDisplay } from "@/utils/calendar.util";
import { updateSchedule } from "@/actions/schedule";
import CoachScheduleForm from "./coach-schedule-form";
import { PencilIcon } from "lucide-react";

export default function CoachScheduleCard({ user, edit, setEdit }) {
  return edit ? (
    <CoachScheduleForm
      user={user}
      formAction={updateSchedule.bind(null, user?.schedule?.id)}
      defaultValues={{
        daysOfWeek: user.schedule.daysOfWeek,
        slotLength: user.schedule.slotLength,
        startTime: user.schedule.startTime,
        endTime: user.schedule.endTime,
        holidays: user.schedule.holidays,
      }}
      setEdit={setEdit}
      showCancel={true}
      buttonText="Update Schedule"
    />
  ) : (
    <Card className="w-4/5 2xl:w-7/12 mt-10 mx-auto bg-neutral-200 px-5">
      <CardHeader className="flex flex-row justify-between rounded-t-lg">
        <div className="text-xl mx-auto font-bold">Your Schedule</div>
        <PencilIcon
          className="w-6 h-6 cursor-pointer"
          onClick={() => setEdit(true)}
        />
      </CardHeader>
      <CardContent className="bg-white py-3 rounded-lg">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mx-auto">Working Days:</h3>
          <div className="flex flex-row justify-center space-x-10 mt-5 mb-3">
            {user.schedule.daysOfWeek.map((item) => {
              const dayItem = daysOfWeek.find((day) => day.value === item);
              return (
                <div
                  className="px-5 py-2 bg-neutral-200 rounded-lg shadow-md"
                  key={dayItem.value}
                >
                  {dayItem.name}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardContent className="bg-white py-3 rounded-lg mt-5">
        <div className="flex flex-col">
          <h3 className="text-xl font-bold mx-auto">Timings:</h3>
          <div className="flex flex-row justify-center gap-32 text-xl mt-5">
            <p>
              <span className="font-bold">Start:</span>{" "}
              {timeDisplay({
                hours: user.schedule.startTime.getHours(),
                minutes: user.schedule.startTime.getMinutes(),
              })}
            </p>
            <p>
              <span className="font-bold">End:</span>{" "}
              {timeDisplay({
                hours: user.schedule.endTime.getHours(),
                minutes: user.schedule.endTime.getMinutes(),
              })}
            </p>
          </div>
        </div>
      </CardContent>
      <CardContent className="bg-white py-3 rounded-lg mt-5">
        <div className="flex flex-col">
          <div className="flex flex-row justify-center gap-32 text-xl">
            <p>
              <span className="font-bold">Duration of one session:</span>{" "}
              {user.schedule.slotLength} minutes
            </p>
          </div>
        </div>
      </CardContent>

      <CardContent className="bg-white py-3 rounded-lg my-5">
        <div className="flex flex-col mt-3">
          <div className="flex flex-col justify-center gap-4 text-xl">
            <h3 className="text-xl font-bold w-full text-center">Holidays:</h3>
            {user.schedule.holidays.length > 0 && (
              <div className="flex flex-row gap-4 flex-wrap">
                {user.schedule.holidays.map((item, index) => (
                  <div
                    className="px-3 py-2 w-fit text-center bg-neutral-200"
                    key={index}
                  >
                    {dateDisplay(item)}
                  </div>
                ))}
              </div>
            )}
            {user.schedule.holidays.length === 0 && (
              <div className="px-16 py-8 mx-auto text-center text-2xl font-bold text-neutral-400 bg-neutral-200">
                No Holidays Selected
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
