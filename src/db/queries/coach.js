"use server";

import { db } from "@/db";
import { cache } from "react";
import { Role } from "@prisma/client";

export const getCoachesByArea = cache(async (areaIds) => {
  if (areaIds.length === 0) {
    const coaches = await db.user.findMany({
      where: { role: Role.COACH, schedule: { isNot: null } },
      include: {
        areas: true,
        schedule: true,
      },
    });
    return coaches;
  }

  const coaches = await db.user.findMany({
    where: { areas: { some: { id: { in: areaIds } } }, role: Role.COACH },
    include: {
      areas: true,
    },
  });

  return coaches;
});

export const getCoachById = cache(async (coachId) => {
  const coach = await db.user.findUnique({
    where: { id: coachId },
    include: {
      schedule: true,
      tokens: true,
      areas: true,
      coachSlots: true,
    },
  });

  return coach;
});

export const getStudentById = cache(async (studentId) => {
  const student = await db.user.findUnique({
    where: { id: studentId },
  });

  return student;
});
