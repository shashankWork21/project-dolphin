"use server";

import { db } from "@/db";
import { cache } from "react";

export const getTasksByCoach = cache(async (coachId) => {
  const tasks = await db.task.findMany({
    where: { coachId },
    include: {
      student: true,
      recurringTask: {
        include: {
          taskStatuses: {
            include: { recurringTask: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      taskStatus: true,
    },
  });

  return tasks;
});

export const getTasksByStudent = cache(async (studentId) => {
  const tasks = await db.task.findMany({
    where: { studentId },
    include: {
      coach: true,
      recurringTask: {
        include: {
          taskStatuses: {
            include: { recurringTask: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      taskStatus: true,
    },
  });

  return tasks;
});
export const getTasksByStudentAndCoach = cache(async (studentId, coachId) => {
  const tasks = await db.task.findMany({
    where: { studentId, coachId },
    include: {
      student: true,
      recurringTask: {
        include: {
          taskStatuses: {
            include: { recurringTask: true },
            orderBy: { createdAt: "asc" },
          },
        },
      },
      taskStatus: true,
    },
  });

  return tasks;
});
