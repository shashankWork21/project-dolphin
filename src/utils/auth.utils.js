"use server";

import { db } from "@/db";
import { google } from "googleapis";

export async function validateGoogleTokens(tokens, now) {
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
    const { expiry_date } = await authClient.getTokenInfo(token.accessToken);
    if (expiry_date < now.getTime()) {
      if (token.refreshToken) {
        try {
          await authClient.refreshAccessToken();
          await db.token.update({
            where: { id: token.id },
            data: { accessToken: authClient.credentials.access_token },
          });
        } catch (error) {
          await db.token.delete({ where: { id: token.id } });
        }
      }
    }
  }
}
