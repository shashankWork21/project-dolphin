"use client";
import { TaskStatusTag } from "@prisma/client";
import TaskList from "../tasks/task-list";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

export default function DashboardPage({ user, tasks }) {
  return (
    <Tabs defaultValue="all" className="container mx-auto mt-5">
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
      <TabsContent value="repeating">
        <TaskList tasks={tasks.filter((task) => task.recurringTask !== null)} />
      </TabsContent>
    </Tabs>
  );
}
