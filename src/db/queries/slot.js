import { cache } from "react";
import { db } from "@/db";

export const getSlotsByCoach = cache(async (coachId) => {
  try {
    return await db.slot.findMany({
      where: { coachId },
      include: {
        student: true,
        tasks: {
          include: {
            recurringTask: { include: { taskStatuses: true } },
            taskStatus: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: error.message };
  }
});

export const getSlotsByStudent = cache(async (studentId) => {
  try {
    return await db.slot.findMany({
      where: { studentId },
      include: {
        coach: true,
        tasks: {
          include: {
            recurringTask: { include: { taskStatuses: true } },
            taskStatus: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: error.message };
  }
});

export const getUpcomingSlotsByCoach = cache(async (coachId) => {
  try {
    return await db.slot.findMany({
      where: { coachId, startTime: { gte: new Date() } },
      include: {
        student: true,
        tasks: {
          include: {
            recurringTask: { include: { taskStatuses: true } },
            taskStatus: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: error.message };
  }
});

export const getUpcomingSlotsByStudent = cache(async (studentId) => {
  try {
    return await db.slot.findMany({
      where: { studentId, startTime: { gte: new Date() } },
      include: {
        coach: true,
        tasks: {
          include: {
            recurringTask: { include: { taskStatuses: true } },
            taskStatus: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: error.message };
  }
});

export const getOngoingSlotsByCoach = cache(async (coachId) => {
  try {
    return await db.slot.findMany({
      where: {
        coachId,
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      },
      include: {
        student: true,
        tasks: {
          include: {
            recurringTask: { include: { taskStatuses: true } },
            taskStatus: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: error.message };
  }
});

export const getOngoingSlotsByStudent = cache(async (studentId) => {
  try {
    return await db.slot.findMany({
      where: {
        studentId,
        startTime: { lte: new Date() },
        endTime: { gte: new Date() },
      },
      include: {
        coach: true,
        tasks: {
          include: {
            recurringTask: { include: { taskStatuses: true } },
            taskStatus: true,
          },
        },
      },
    });
  } catch (error) {
    return { error: error.message };
  }
});
