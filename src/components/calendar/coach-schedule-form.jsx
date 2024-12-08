"use client";

import { useState, useActionState, useEffect } from "react";
import ClockTimePicker from "../ui/clock-time-picker";
import { dateDisplay, daysOfWeek, timeDisplay } from "@/utils/calendar.util";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { PencilIcon, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Calendar } from "../ui/calendar";
import { Button } from "../ui/button";
import { addDays, set } from "date-fns";
import { Input } from "../ui/input";

export default function CoachScheduleForm({
  formAction,
  user,
  defaultValues,
  setEdit,
  buttonText,
  showCancel,
}) {
  const now = new Date();
  const [date, setDate] = useState(now);
  const [holidays, setHolidays] = useState(defaultValues.holidays);
  const [holidayRange, setHolidayRange] = useState([]);
  const [dateRange, setDateRange] = useState({
    from: now,
    to: addDays(now, 7),
  });

  const [selectedDaysOfWeek, setSelectedDaysOfWeek] = useState(
    daysOfWeek.map((item) => {
      const day = defaultValues.daysOfWeek.find((day) => day === item.value);

      return { ...item, selected: day ? true : false };
    })
  );

  const [startTime, setStartTime] = useState(defaultValues.startTime);
  const [endTime, setEndTime] = useState(defaultValues.endTime);

  const startHours = startTime.getHours();
  const startMinutes = startTime.getMinutes();
  const endHours = endTime.getHours();
  const endMinutes = endTime.getMinutes();

  const handleStartTimeChange = ({ hours, minutes }) => {
    const updatedTime = new Date();
    updatedTime.setHours(hours);
    updatedTime.setMinutes(minutes);
    setStartTime(updatedTime);
  };
  const handleEndTimeChange = ({ hours, minutes }) => {
    const updatedTime = new Date();
    updatedTime.setHours(hours);
    updatedTime.setMinutes(minutes);
    setEndTime(updatedTime);
  };

  const handleCheckboxChange = (value) => {
    setSelectedDaysOfWeek(
      selectedDaysOfWeek.map((day) => {
        if (day.value === value) {
          return { ...day, selected: !day.selected };
        }
        return day;
      })
    );
  };

  const renderedDaysOfWeek = selectedDaysOfWeek.map((day, index) => {
    return (
      <div key={index} className="flex items-center space-x-2 py-2">
        <Checkbox
          value={day.value}
          checked={day.selected}
          onCheckedChange={() => {
            handleCheckboxChange(day.value);
          }}
        />
        <label>{day.name}</label>
      </div>
    );
  });

  const handleDateSelect = (date) => {
    if (!date) return;
    setDate(date);
    if (
      !holidays.map((item) => dateDisplay(item)).includes(dateDisplay(date)) &&
      !holidayRange.map((item) => dateDisplay(item)).includes(dateDisplay(date))
    ) {
      setHolidays((prev) => [...prev, date]);
    }
  };

  const handleDateRangeSelect = (range) => {
    if (!range?.from || !range?.to) return;
    setDateRange(range);
    const start = new Date(range.from);
    start.setHours(0, 0, 0, 0);
    const holidaysFromRange = [];
    for (let i = start.getTime(); i <= range.to.getTime(); i += 86400000) {
      const date = new Date(i);

      if (
        !holidays.map((item) => dateDisplay(item)).includes(dateDisplay(date))
      ) {
        holidaysFromRange.push(date);
      }
    }
    setHolidayRange(holidaysFromRange);
  };

  const consolidatedHolidays = [...holidays, ...holidayRange];

  const formSubmitAction = formAction.bind(null, {
    daysOfWeek: selectedDaysOfWeek
      .filter((day) => day.selected)
      .map((day) => day.value),
    startTime,
    endTime,
    coachId: user.id,
    holidays: consolidatedHolidays,
  });

  const [formState, action] = useActionState(formSubmitAction, {
    errors: {},
    success: false,
  });

  useEffect(() => {
    if (formState.success) {
      setEdit(false);
    }
  }, [formState.success, setEdit]);

  return (
    <div className="container mx-auto flex flex-col items-center">
      <Card className="p-5 bg-neutral-200 mt-10 2xl:w-7/12 md:w-4/5 w-9/10">
        <CardHeader className="text-2xl font-bold w-full text-center">
          Your Coaching Availability
        </CardHeader>
        <CardContent className="flex flex-col items-start justify-start bg-white p-5 mb-5 rounded-xl ">
          <p className="mb-2 text-lg font-bold w-full text-center">
            Days of the Week
          </p>
          <div className="flex flex-row mt-4 space-x-6 mx-auto flex-wrap">
            {renderedDaysOfWeek}
          </div>
        </CardContent>
        <div className="flex flex-row space-x-5">
          <CardContent className="bg-white p-5 items-center rounded-xl mb-5 flex-1">
            <div className="flex flex-row justify-between">
              <p className="text-lg">
                Start Time:{" "}
                <span className="font-bold">
                  {timeDisplay({ hours: startHours, minutes: startMinutes })}
                </span>
              </p>
              <Dialog>
                <DialogTrigger>
                  <PencilIcon size={24} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="my-5 text-xl w-full text-center">
                      Pick Start Time
                    </DialogTitle>
                  </DialogHeader>
                  <ClockTimePicker
                    selectedTime={{ hours: startHours, minutes: startMinutes }}
                    onTimeChange={handleStartTimeChange}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
          <CardContent className="bg-white p-5 mb-5 items-center rounded-xl  flex-1">
            <div className="flex flex-row justify-between">
              <p className="text-lg">
                End Time:{" "}
                <span className="font-bold">
                  {timeDisplay({ hours: endHours, minutes: endMinutes })}
                </span>
              </p>
              <Dialog>
                <DialogTrigger>
                  <PencilIcon size={24} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="my-5 text-xl w-full text-center">
                      Pick End Time
                    </DialogTitle>
                  </DialogHeader>
                  <ClockTimePicker
                    selectedTime={{ hours: endHours, minutes: endMinutes }}
                    onTimeChange={handleEndTimeChange}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </div>
        <CardContent className="bg-white p-5 items-center rounded-xl mb-5">
          <p className="text-lg font-bold w-full text-center">Pick Holidays</p>
          <div className="mt-5">
            {consolidatedHolidays.length !== 0 && (
              <>
                <p className="text-lg font-bold w-full text-center">
                  Selected Holidays:
                </p>
                <div className="flex flex-row space-x-2 items-center flex-wrap mt-2">
                  {consolidatedHolidays.map((holiday, index) => {
                    return (
                      <div
                        key={index}
                        className="flex gap-4 bg-neutral-200 px-2 py-1 rounded-lg shadow-md my-2"
                      >
                        <p className="text-sm">{dateDisplay(holiday)}</p>
                        <X
                          className="cursor-pointer"
                          size={14}
                          onClick={() => {
                            setHolidays((prev) =>
                              prev.filter((item) => item !== holiday)
                            );
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 w-full flex justify-center">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setHolidays([]);
                      setHolidayRange([]);
                    }}
                    className="mx-auto"
                  >
                    Clear All
                  </Button>
                </div>
              </>
            )}
            {consolidatedHolidays.length === 0 && (
              <div className="flex flex-col items-center justify-center p-5 text-xl mx-auto w-fit font-bold text-neutral-500 bg-neutral-200 rounded-xl">
                No Holidays Selected
              </div>
            )}
          </div>
          <Tabs className="mx-auto" defaultValue="individual">
            <TabsList className="flex flex-row items-center justify-between w-1/2 mt-5 mx-auto text-black">
              <TabsTrigger className="w-1/2" value="individual">
                Individual Dates
              </TabsTrigger>
              <TabsTrigger className="w-1/2" value="range">
                Date Range
              </TabsTrigger>
            </TabsList>
            <TabsContent value="individual">
              <Calendar
                mode="single"
                className="rounded-md border border-neutral-300 shadow-lg w-fit mx-auto mt-5 text-lg "
                onSelect={handleDateSelect}
                selected={date}
              />
            </TabsContent>
            <TabsContent value="range">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
                className="rounded-md border border-neutral-300 shadow-lg w-fit mx-auto mt-5 text-lg "
              />
            </TabsContent>
          </Tabs>
        </CardContent>

        <form action={action}>
          <CardContent className="bg-white p-5 items-center rounded-xl mb-5">
            <div className="flex md:flex-row space-y-3 md:space-y-0 flex-col md:space-x-3">
              <label className="text-lg font-bold w-fit">
                Session Duration (minutes)
              </label>
              <Input
                defaultValue={defaultValues.slotLength}
                name="slotLength"
                type="number"
                label="Session Duration"
                placeholder="Duration of your sessions (minutes)"
                className="text-lg md:w-fit w-full"
              />
              {!!formState?.errors?.slotLength && (
                <ul className="text-red-600 w-full md:w-fit">
                  {formState?.errors?.slotLength?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
          <div className="w-full flex flex-row items-center justify-center space-x-3">
            <Button type="submit" className="w-1/3">
              {buttonText}
            </Button>
            {showCancel && (
              <Button
                variant="outline"
                className="w-1/3"
                onClick={() => {
                  setEdit(false);
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
