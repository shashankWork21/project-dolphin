"use client";

import { useState } from "react";
import { Calendar } from "../ui/calendar";
import ScheduleCall from "./schedule-call";
import { dateDisplay, timeDisplay } from "@/utils/calendar.util";
import { useAuth } from "@/context/auth-context";

export default function CoachSchedulePage({ coach }) {
  const { user } = useAuth();
  const now = new Date();
  const [date, setDate] = useState(now);
  const [showTimes, setShowTimes] = useState(true);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateSelect = (date) => {
    setDate(date);
    setShowTimes(true);

    const slotsForDay = [];
    let startTime = new Date(date);
    let endTime = new Date(date);
    startTime.setHours(
      coach.schedule.startTime.getHours(),
      coach.schedule.startTime.getMinutes(),
      0,
      0
    );
    endTime.setHours(
      coach.schedule.startTime.getHours(),
      coach.schedule.startTime.getMinutes(),
      0,
      0
    );

    while (endTime.getHours() < coach.schedule.endTime.getHours()) {
      const existingSlot = coach.coachSlots?.find((slot) => {
        const delta = Math.abs(slot.startTime.getTime() - endTime.getTime());
        return delta <= 1000 * 60;
      });
      const condition =
        !existingSlot &&
        coach.schedule.daysOfWeek.includes(endTime.getDay()) &&
        !coach.schedule.holidays
          .map((date) => dateDisplay(date))
          .includes(dateDisplay(endTime));

      if (condition) {
        slotsForDay.push(new Date(endTime));
      }
      endTime.setMinutes(endTime.getMinutes() + coach.schedule.slotLength);
    }
    if (!slotsForDay.length) {
      setShowTimes(false);
      setAvailableTimes([]);
      setSelectedTime(null);
    } else {
      setAvailableTimes(slotsForDay);
      setSelectedTime(slotsForDay[0]);
    }
  };

  const renderedTimes = availableTimes.map((time) => {
    return (
      <div
        key={time.getTime()}
        className={`px-5 py-2 bg-neutral-200 rounded-lg shadow-md text-lg text-center w-3/5 mx-auto cursor-pointer ${
          selectedTime === time ? "bg-neutral-800 text-white" : ""
        }`}
        onClick={() => setSelectedTime(time)}
      >
        {timeDisplay({ hours: time.getHours(), minutes: time.getMinutes() })}
      </div>
    );
  });

  const selectedDateTime = new Date(date);
  if (selectedTime) {
    selectedDateTime.setHours(selectedTime?.getHours());
    selectedDateTime.setMinutes(selectedTime?.getMinutes());
  }

  return (
    <div className="grid grid-cols-10">
      <div className="col-span-3 2xl:col-span-2 h-screen border-r-2 border-neutral-200">
        <h2 className="my-10 text-2xl font-bold w-full text-center">
          Pick a Date
        </h2>
        <Calendar
          mode="single"
          className="rounded-md border border-neutral-300 shadow-lg w-fit mx-auto my-5 text-lg bg-neutral-200"
          onSelect={handleDateSelect}
          selected={date}
        />
        {availableTimes.length > 0 && showTimes && (
          <div>
            <h2 className="my-10 text-2xl font-bold w-full text-center">
              Pick a Time
            </h2>
            <div className="flex flex-col space-y-8">{renderedTimes}</div>
          </div>
        )}
        {availableTimes.length === 0 && (
          <div>
            <h2 className="my-10 px-5 py-3 text-2xl font-bold text-center w-3/5 mx-auto bg-neutral-100 text-neutral-500">
              No slots available for {dateDisplay(date)}
            </h2>
          </div>
        )}
      </div>
      <div className="col-span-7 2xl:col-span-8">
        <ScheduleCall coach={coach} date={selectedDateTime} student={user} />
      </div>
    </div>
  );
}
