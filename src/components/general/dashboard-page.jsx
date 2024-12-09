"use client";
import { Role, TaskStatusTag } from "@prisma/client";
import TaskList from "../tasks/task-list";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import StudentList from "./student-list";
import SlotList from "../calendar/slot-list";

export default function DashboardPage({ user, tasks, slots }) {
  const defaultValue = user.role === Role.STUDENT ? "all" : "slots";
  return (
    <Tabs
      defaultValue={defaultValue}
      className="container mx-auto mt-5 flex flex-col items-center"
    >
      {user.role === Role.STUDENT && (
        <TabsList className="w-full">
          <TabsTrigger value="all" className="w-1/6">
            All Tasks
          </TabsTrigger>
          <TabsTrigger value="notStarted" className="w-1/6">
            Not Started
          </TabsTrigger>
          <TabsTrigger value="inProgress" className="w-1/6">
            In Progress
          </TabsTrigger>
          <TabsTrigger value="onHold" className="w-1/6">
            On Hold
          </TabsTrigger>
          <TabsTrigger value="completed" className="w-1/6">
            Completed
          </TabsTrigger>
          <TabsTrigger value="repeating" className="w-1/6">
            Repeating Tasks
          </TabsTrigger>
        </TabsList>
      )}
      {user.role === Role.COACH && (
        <TabsList className="w-1/2">
          <TabsTrigger value="slots" className="w-1/2">
            Upcoming Slots
          </TabsTrigger>
          <TabsTrigger value="clients" className="w-1/2">
            Clients
          </TabsTrigger>
        </TabsList>
      )}
      <TabsContent value="all">
        <TaskList tasks={tasks} />
      </TabsContent>
      <TabsContent value="notStarted">
        <TaskList
          tasks={tasks.filter(
            (task) =>
              task.recurringTask === null &&
              task.taskStatus.status === TaskStatusTag.NOT_STARTED
          )}
        />
      </TabsContent>
      <TabsContent value="inProgress">
        <TaskList
          tasks={tasks.filter(
            (task) =>
              task.recurringTask === null &&
              task.taskStatus.status === TaskStatusTag.IN_PROGRESS
          )}
        />
      </TabsContent>
      <TabsContent value="onHold">
        <TaskList
          tasks={tasks.filter(
            (task) =>
              task.recurringTask === null &&
              task.taskStatus.status === TaskStatusTag.ON_HOLD
          )}
        />
      </TabsContent>
      <TabsContent value="completed">
        <TaskList
          tasks={tasks.filter(
            (task) =>
              task.recurringTask === null &&
              task.taskStatus.status === TaskStatusTag.COMPLETED
          )}
        />
      </TabsContent>
      <TabsContent value="slots" className="w-full">
        <SlotList slots={slots} user={user} />
      </TabsContent>
      <TabsContent value="clients" className="w-full">
        <StudentList slots={slots} />
      </TabsContent>
    </Tabs>
  );
}
