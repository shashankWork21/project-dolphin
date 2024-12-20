"use client";

import { useActionState } from "react";
import { dateDisplay, timeDisplay } from "@/utils/calendar.util";
import { Card, CardContent, CardHeader } from "../ui/card";
import { createSlot } from "@/actions/slot";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

export default function ScheduleCall({ coach, date, student, override }) {
  const startTime = date;
  const endTime = new Date(date.getTime() + coach.schedule.slotLength * 60000);
  const now = new Date();

  const data = { student, coach, startTime, endTime };

  const [formState, action] = useActionState(createSlot.bind(null, data), {
    errors: {},
    success: false,
  });

  const existingSlot = coach.coachSlots?.find((slot) => {
    const delta = Math.abs(slot.startTime.getTime() - endTime.getTime());
    return delta <= 1000 * 60;
  });
  const condition =
    override &&
    Math.abs(date.getTime() - now.getTime()) > 1000 * 600 &&
    !existingSlot &&
    coach.schedule.daysOfWeek.includes(endTime.getDay()) &&
    !coach.schedule.holidays
      .map((date) => dateDisplay(date))
      .includes(dateDisplay(endTime));

  return condition ? (
    <div className="w-full h-screen">
      <h2 className="text-2xl font-bold w-full text-center my-10">
        Book a Session with {coach.firstName} {coach.lastName}
      </h2>
      <Card className="w-4/5 2xl:w-7/12 mt-10 mx-auto bg-neutral-200 px-5">
        <CardHeader>
          <h2 className="text-2xl font-bold w-full text-center">
            Review Details
          </h2>
        </CardHeader>
        <CardContent className="flex flex-row items-center gap-32 justify-center">
          <div className="flex flex-row gap-3 w-fit">
            <p className="text-xl">Session Start:</p>
            <p className="font-bold text-xl">
              {timeDisplay({
                hours: startTime.getHours(),
                minutes: startTime.getMinutes(),
              })}
            </p>
          </div>
          <div className="flex flex-row gap-3 w-fit">
            <p className="text-xl">Session End:</p>
            <p className="font-bold text-xl">
              {timeDisplay({
                hours: endTime.getHours(),
                minutes: endTime.getMinutes(),
              })}
            </p>
          </div>
        </CardContent>
        <CardContent className="mt-5">
          <form
            action={action}
            className="flex flex-col items-center space-y-5"
          >
            <Textarea
              name="description"
              className="bg-white"
              placeholder="What do you want the professional to know?"
              rows={8}
            />
            <Button type="submit" className="w-1/2">
              Book Session
            </Button>
            {!!formState.errors._form && (
              <ul className="text-red-600">
                {formState.errors?._form?.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            {formState.success && (
              <div className="text-green-900 bg-green-200 px-5 py-3 rounded-lg font-bold text-lg">
                Session Booked Successfully!
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  ) : (
    <div className="bg-neutral-100 text-neutral-600 px-20 py-8 text-3xl w-fit text-center mx-auto mt-10 font-bold">
      Looks like there are no sessions available for this day
    </div>
  );
}
