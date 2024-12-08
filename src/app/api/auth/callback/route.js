import { db } from "@/db";
import { scopes as scopeList } from "@/utils/scopes";
import { google } from "googleapis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import axios from "axios";
import { redirect } from "next/navigation";
import { deleteSessions } from "@/actions/auth";
import { roles } from "@/utils/roles";

export async function GET(request, response) {
  const searchParams = request.nextUrl.searchParams;
  const error = searchParams.get("error");
  if (error) {
    redirect("/");
  }

  const state = JSON.parse(searchParams.get("state"));

  let redirectUrl = state.redirect_url;
  const { role, user_id: userId } = state;

  const authClient = new google.auth.OAuth2(
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
  );

  const { tokens: googleTokens } = await authClient.getToken(
    searchParams.get("code")
  );

  authClient.setCredentials(googleTokens);

  const scopes = googleTokens.scope.split(" ").map((value) => {
    const scopeItem = scopeList.find((item) => item.value === value);
    return scopeItem?.scope || "EMAIL";
  });

  if (!userId) {
    const { data } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${authClient.credentials.access_token}`,
        },
      }
    );

    const { email } = data;

    let user = await db.user.findUnique({ where: { email } });

    if (!user) {
      if (!role) {
        redirect("/");
      }
      user = await db.user.create({
        data: {
          email,
          role: roles[role],
          firstName: data.given_name,
          lastName: data.family_name,
        },
      });
      redirectUrl = role === "coach" ? `/coach/details` : redirectUrl;
    }

    const now = new Date().getTime();
    const expiresAt = new Date(now + 2 * 3600 * 1000);

    const session = await db.session.create({
      data: { userId: user.id, expiresAt },
    });

    const token = await db.token.findFirst({
      where: {
        userId: user.id,
        scopes: { hasEvery: scopes },
      },
    });

    await db.token.upsert({
      where: { id: token?.id || "" },
      create: {
        userId: user.id,
        scopes,
        sessionId: session.id,
        accessToken: googleTokens.access_token,
        refreshToken: googleTokens.refresh_token || "",
      },
      update: {
        accessToken: googleTokens.access_token,
        refreshToken: googleTokens.refresh_token || token?.refreshToken || "",
      },
    });

    const sessionToken = jwt.sign(
      { id: session.id },
      process.env.NEXT_PUBLIC_SESSION_SECRET,
      { expiresIn: "2h" }
    );
    if (user) {
      await deleteSessions(user.id);
    }
    const c = await cookies();
    c.set("session", sessionToken, {
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    const token = await db.token.findFirst({
      where: {
        userId,
        scopes: { hasEvery: scopes },
      },
    });
    await db.token.upsert({
      where: { id: token?.id || "" },
      create: {
        userId,
        scopes,
        accessToken: googleTokens.access_token,
        refreshToken: googleTokens.refresh_token || "",
      },
      update: {
        accessToken: googleTokens.access_token,
        refreshToken: googleTokens.refresh_token || token?.refreshToken || "",
      },
    });
  }

  redirect(redirectUrl);
}
