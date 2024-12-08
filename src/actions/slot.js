"use server";

import { db } from "@/db";
import { google } from "googleapis";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { Scope, SlotStatus } from "@prisma/client";

export async function createSlot(data, formState, formData) {
  try {
    const { startTime, endTime, coach, student } = data;
    const description = formData.get("description") || "";

    const authClient = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );

    const calendar = google.calendar({
      version: "v3",
      auth: process.env.NEXT_PUBLIC_CALENDAR_API_KEY,
    });

    const token = coach.tokens.find((token) =>
      token.scopes.includes(Scope.CALENDAR)
    );

    authClient.setCredentials({
      access_token: token.accessToken,
      refresh_token: token.refreshToken || "",
    });

    const calendarInvite = await calendar.events.insert({
      calendarId: "primary",
      auth: authClient,
      sendUpdates: "all",
      conferenceDataVersion: 1,
      requestBody: {
        summary: `${coach.firstName} - ${student.firstName}, 1-on-1 coaching slot`,
        description,
        start: {
          dateTime: new Date(startTime).toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: new Date(endTime).toISOString(),
          timeZone: "Asia/Kolkata",
        },
        conferenceData: {
          createRequest: {
            requestId: `${crypto.randomBytes(16).toString("hex")}-${crypto
              .randomBytes(12)
              .toString("hex")}`,
          },
        },
        creator: {
          email: coach.email,
          self: true,
        },

        attendees: [
          {
            email: student.email,
            organizer: false,
            responseStatus: "accepted",
          },
          {
            email: coach.email,
            organizer: true,
            responseStatus: "accepted",
          },
        ],
      },
    });
    await db.slot.create({
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        coachId: data.coach.id,
        studentId: data.student.id,
        title: `${student.firstName} - ${coach.firstName}, 1-on-1 coaching slot`,
        description,
        meetingLink: calendarInvite.data.hangoutLink || "",
        eventId: calendarInvite.data.id,
      },
    });

    revalidatePath("/calendar");
    revalidatePath(`/calendar${data.coach.id}`);
    return { success: true, errors: {} };
  } catch (error) {
    console.log(error);
    return { errors: { _form: ["Something went wrong"] } };
  }
}

export async function modifySlot(data, formState, formData) {
  try {
    await db.slot.update({
      where: { id: data.id },
      data: {
        startTime: data.startTime,
        endTime: data.endTime,
        description: formData.get("description") || "",
        summary: data.summary,
      },
    });
    revalidatePath("/calendar");
    revalidatePath(`/calendar${data.coach.id}`);
    return { success: true, errors: {} };
  } catch (error) {
    return { error: error.message };
  }
}

export async function cancelSlotBooking(id) {
  try {
    const slot = await db.slot.findUnique({
      where: { id },
      include: { coach: { include: { tokens: true } } },
    });
    if (!slot) {
      return { errors: { _form: ["Slot not found"] } };
    }
    if (slot.status === SlotStatus.COMPLETED) {
      return { errors: { _form: ["Slot is completed"] } };
    }
    if (slot.status === SlotStatus.CANCELLED) {
      return { errors: { _form: ["Slot is already cancelled"] } };
    }
    const authClient = new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );
    const calendar = google.calendar({
      version: "v3",
      auth: process.env.NEXT_PUBLIC_CALENDAR_API_KEY,
    });
    const token = slot.coach.tokens.find((token) =>
      token.scopes.includes(Scope.CALENDAR)
    );

    authClient.setCredentials({
      access_token: token?.accessToken,
      refresh_token: token?.refreshToken || "",
    });

    await calendar.events.delete({
      calendarId: "primary",
      eventId: slot.eventId,
      auth: authClient,
      sendUpdates: "all",
    });

    await db.slot.update({
      where: { id },
      data: { status: SlotStatus.CANCELLED },
    });
  } catch (error) {
    return { error: error.message };
  }
}

export async function completeSlots(user) {
  const slots = await db.slot.findMany({
    where: {
      status: SlotStatus.SCHEDULED,
      endTime: { lte: new Date() },
      OR: [{ coachId: user.id }, { studentId: user.id }],
    },
  });
  for (const slot of slots) {
    await db.slot.update({
      where: { id: slot.id },
      data: { status: SlotStatus.COMPLETED },
    });
  }
}
