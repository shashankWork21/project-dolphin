"use client";

import { Role } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CoachSchedule from "./coach-schedule";
import SearchCoach from "./coach-search";
import SlotList from "./slot-list";

export default function CalendarTabs({ user, slots }) {
  const upcomingSlots = slots.filter(
    (slot) => new Date(slot.startTime) > new Date()
  );
  const pastSlots = slots.filter((slot) => new Date(slot.endTime) < new Date());
  const ongoingSlots = slots.filter(
    (slot) =>
      new Date(slot.startTime) < new Date() &&
      new Date(slot.endTime) > new Date()
  );

  const now = new Date();
  const _9HoursLater = new Date(now.getTime() + 9 * 3600 * 1000);

  return (
    <Tabs
      className="w-full"
      defaultValue={ongoingSlots.length > 0 ? "ongoing" : "upcoming"}
    >
      <TabsList className="mt-5 flex flex-row items-center justify-between w-1/2 mx-auto text-black">
        <TabsTrigger className="w-1/4" value="upcoming">
          Upcoming Sessions
        </TabsTrigger>
        <TabsTrigger className="w-1/4" value="past">
          Past Sessions
        </TabsTrigger>

        <TabsTrigger className="w-1/4" value="ongoing">
          Ongoing Sessions
        </TabsTrigger>
        {user.role === Role.COACH && (
          <TabsTrigger className="w-1/4" value="schedule">
            Schedule
          </TabsTrigger>
        )}
        {user.role === Role.STUDENT && (
          <TabsTrigger className="w-1/4" value="search">
            Search
          </TabsTrigger>
        )}
      </TabsList>
      <TabsContent value="upcoming">
        <SlotList slots={upcomingSlots} user={user} />
      </TabsContent>
      <TabsContent value="ongoing">
        <SlotList slots={ongoingSlots} user={user} />
      </TabsContent>
      <TabsContent value="past">
        <SlotList slots={pastSlots} user={user} />
      </TabsContent>
      <TabsContent value="schedule">
        <CoachSchedule user={user} />
      </TabsContent>
      <TabsContent value="search">
        <SearchCoach />
      </TabsContent>
    </Tabs>
  );
}
