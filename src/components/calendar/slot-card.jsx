"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "../ui/card";
import { dateDisplay, timeDisplay } from "@/utils/calendar.util";
import { Button } from "../ui/button";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { Role, SlotStatus } from "@prisma/client";
import AiTaskSheet from "../tasks/ai-task-sheet";
import TaskAccordionList from "../tasks/task-accordion-list";

export default function SlotCard({ slot, user }) {
  return (
    <Card className="w-full lg:w-3/5 mx-auto mt-8 bg-neutral-100 shadow-lg rounded-lg overflow-hidden">
      <CardHeader className="bg-neutral-600 text-white py-4">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-semibold">
            {user.role === Role.COACH
              ? `Student: ${slot.student.firstName} ${slot.student.lastName}`
              : `Coach: ${slot.coach.firstName} ${slot.coach.lastName}`}
          </h2>
          <div className="flex flex-row gap-3 items-center">
            <CalendarIcon size={18} />
            {dateDisplay(slot.startTime)}
          </div>
          <div className="flex flex-row gap-3 items-center">
            <ClockIcon size={18} />
            <p>
              {timeDisplay({
                hours: slot.startTime.getHours(),
                minutes: slot.startTime.getMinutes(),
              })}{" "}
              to{" "}
              {timeDisplay({
                hours: slot.endTime.getHours(),
                minutes: slot.endTime.getMinutes(),
              })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="my-3 w-full rounded-lg bg-white px-3 py-2">
          <h3 className="font-semibold text-neutral-800 mb-2">
            Notes for Coach:
          </h3>
          <p className="text-gray-700">{slot.description}</p>
        </div>
        {slot.summary && (
          <div className="my-3 w-full rounded-lg bg-white px-3 py-2">
            <h3 className="font-semibold text-neutral-800 mb-2">Summary:</h3>
            <p className="text-gray-700">{slot.summary}</p>
          </div>
        )}
        <div className="mt-6 flex flex-row gap-4 justify-center">
          {slot.status !== SlotStatus.CANCELLED &&
            slot.status !== SlotStatus.COMPLETED &&
            !!slot.meetingLink && (
              <Link href={slot.meetingLink} target="_blank">
                <Button className="hover:bg-neutral-500">Join Call</Button>
              </Link>
            )}
          {user.role === Role.COACH &&
            slot.status === SlotStatus.COMPLETED &&
            slot.tasks.length === 0 && <AiTaskSheet slot={slot} user={user} />}
          {slot.tasks.length > 0 && (
            <div className="flex flex-col items-start w-full">
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">
                Tasks:
              </h3>
              <TaskAccordionList
                tasks={slot.tasks}
                className="bg-white px-4 rounded-lg w-full"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
