"use server";

import { db } from "@/db";
import { validateGoogleTokens } from "@/utils/auth.utils";
import { hashPassword } from "@/utils/password.util";
import { roles } from "@/utils/roles";
import { createUserWithPasswordSchema, userSchema } from "@/utils/user.utils";
import { Role } from "@prisma/client";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cancelSlotBooking } from "./slot";

export async function validateSession() {
  const c = await cookies();
  const sessionToken = c.get("session")?.value || "";
  const now = new Date();
  try {
    const sessionObject = jwt.verify(sessionToken, process.env.SESSION_SECRET);
    const session = await db.session.findUnique({
      where: { id: sessionObject.id },
      include: {
        user: {
          include: {
            tokens: true,
            areas: true,
            schedule: true,
          },
        },
        tokens: true,
      },
    });
    if (!session) {
      throw new Error("Session not found");
    }
    const tokens = session.tokens;
    await validateGoogleTokens(tokens, now);
    if (Math.abs(session.expiresAt.getTime() - now.getTime()) < 10000) {
      await db.session.update({
        where: { id: session.id },
        data: {
          expiresAt: new Date(now.getTime() + 2 * 60 * 60 * 1000),
        },
      });
    }
    return { session, user: session.user };
  } catch (error) {
    console.log(error);
    redirect("/");
  }
}

export async function deleteSessions(userId) {
  const now = new Date();
  try {
    await db.session.deleteMany({
      where: {
        userId,
        expiresAt: {
          lte: now,
        },
      },
    });
  } catch (error) {
    redirect("/");
  }
}

export async function deleteUsers(formState) {
  const users = await db.user.findMany({ include: { tokens: true } });
  for (const user of users) {
    const authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );
    for (const token of user.tokens) {
      authClient.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken || "",
      });
      authClient.revokeToken(token.accessToken);
      if (token.refreshToken) {
        authClient.revokeToken(token.refreshToken);
      }
    }
    await db.user.delete({ where: { id: user.id } });
  }
  await db.session.deleteMany({});
  await db.token.deleteMany({});
  return { success: true };
}

export async function createUserWithPassword(role, formState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");

  if (password !== confirmPassword) {
    return {
      errors: {
        confirmPassword: ["Passwords do not match."],
      },
    };
  }

  const result = createUserWithPasswordSchema.safeParse({
    email,
    password,
    firstName,
    lastName,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  try {
    const passwordHash = await hashPassword(password);
    const user = await db.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        role: roles[role],
      },
    });
    const session = await db.session.create({
      data: { userId: user.id, expiresAt },
    });

    const sessionToken = jwt.sign(
      { id: session.id },
      process.env.SESSION_SECRET,
      { expiresIn: "2h" }
    );
    const c = await cookies();
    c.set("session", sessionToken, {
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    return { errors: { _form: ["An error occurred. Please try again."] } };
  }
  redirect(`/${role}/dashboard`);
}

export async function loginUser(formState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const user = await db.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      errors: {
        _form: ["Invalid email or password."],
      },
    };
  }

  const passwordMatch = await comparePassword(password, user.passwordHash);

  if (!passwordMatch) {
    return {
      errors: {
        _form: ["Invalid email or password."],
      },
    };
  }

  try {
    const now = new Date().getTime();
    const expiresAt = new Date(now + 2 * 3600 * 1000);

    const session = await db.session.create({
      data: { userId: user.id, expiresAt },
    });

    const sessionToken = jwt.sign(
      { id: session.id },
      process.env.SESSION_SECRET,
      { expiresIn: "2h" }
    );
    const c = await cookies();
    c.set("session", sessionToken, {
      secure: process.env.NODE_ENV === "production",
    });
  } catch (error) {
    return { errors: { _form: ["An error occurred. Please try again."] } };
  }
  redirect(`/dashboard`);
}

export async function logout() {
  try {
    const c = await cookies();
    const sessionToken = c.get("session")?.value || "";
    const session = jwt.verify(sessionToken, process.env.SESSION_SECRET);
    await db.session.delete({
      where: { id: session.id },
    });
    return { success: true };
  } catch (error) {
    redirect("/");
  }
}

export async function verifyCoach() {
  const c = await cookies();
  const sessionToken = c.get("session")?.value || "";
  const sessionObj = jwt.verify(sessionToken, process.env.SESSION_SECRET);
  const session = await db.session.findUnique({
    where: { id: sessionObj.id },
    include: { user: { include: { tokens: true } } },
  });
  const user = session.user;
  if (user.role !== Role.COACH) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function revokeTokens(formState, formData) {
  try {
    const tokens = await db.token.findMany();
    for (const token of tokens) {
      const authClient = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
      );
      authClient.setCredentials({
        access_token: token.accessToken,
        refresh_token: token.refreshToken || "",
      });
      authClient.revokeToken(token.accessToken);
      if (token.refreshToken) {
        authClient.revokeToken(token.refreshToken);
      }
      await db.token.delete({ where: { id: token.id } });
    }
    return { success: true };
  } catch (error) {
    return {
      errors: { _form: ["An error occurred. Please try again."] },
      success: false,
    };
  }
}

export async function modifyUserDetails(formState, formData) {
  const c = await cookies();
  const sessionToken = c.get("session")?.value || "";
  const sessionObj = jwt.verify(sessionToken, process.env.SESSION_SECRET);
  const session = await db.session.findUnique({
    where: { id: sessionObj.id },
    include: { user: true },
  });
  const user = session.user;
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");

  const result = userSchema.safeParse({
    firstName,
    lastName,
  });

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      success: false,
    };
  }

  if (password && password !== confirmPassword) {
    return {
      errors: {
        confirmPassword: ["Passwords do not match."],
      },
      success: false,
    };
  }

  if (password) {
    const passwordHash = await hashPassword(password);
    await db.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
        passwordHash,
      },
    });
  } else {
    await db.user.update({
      where: { id: user.id },
      data: {
        firstName,
        lastName,
      },
    });
  }

  return { errors: {}, success: true };
}
