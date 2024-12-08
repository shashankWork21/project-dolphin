"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";

export async function createSchedule(data, formState, formData) {
  console.log(data);
  console.log(formData.get("slotLength"));
  try {
    await db.schedule.create({
      data: {
        daysOfWeek: data.daysOfWeek,
        slotLength: parseInt(formData.get("slotLength")),
        startTime: data.startTime,
        endTime: data.endTime,
        coachId: data.coachId,
        holidays: data.holidays || [],
      },
    });
  } catch (error) {
    console.log(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
  revalidatePath("/calendar");
  return { errors: {}, success: true };
}

export async function updateSchedule(id, data, formState, formData) {
  console.log(id);
  console.log(data.holidays);
  console.log(formData.get("slotLength"));
  try {
    await db.schedule.update({
      where: { id },
      data: {
        daysOfWeek: data.daysOfWeek,
        slotLength: parseInt(formData.get("slotLength")),
        startTime: data.startTime,
        endTime: data.endTime,
        holidays: data.holidays,
      },
    });
  } catch (error) {
    console.log(error);
    return {
      errors: { _form: ["Something went wrong, try again"] },
      success: false,
    };
  }
  revalidatePath("/calendar");
  return { errors: {}, success: true };
}

export async function getScheduleByCoach(coachId) {
  return db.schedule.findMany({
    where: { coachId },
  });
}

export async function getScheduleByAreas(areas) {
  return db.schedule.findMany({
    where: {
      coach: {
        areas: {
          some: {
            id: { in: areas },
          },
        },
      },
    },
    include: {
      coach: true,
    },
  });
}
