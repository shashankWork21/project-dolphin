import { scopes } from "@/utils/scopes";
import { google } from "googleapis";
import { redirect } from "next/navigation";

export function GET(request) {
  let url;
  try {
    const searchParams = request.nextUrl.searchParams;

    console.log(searchParams.get("role"));

    const authClient = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/callback`
    );
    url = authClient.generateAuthUrl({
      access_type: "offline",
      scope: searchParams
        .get("scope")
        .split(",")
        .map((value) => scopes.find((item) => item.scope === value).value),
      state: JSON.stringify({
        role: searchParams.get("role") || null,
        redirect_url: searchParams.get("redirect_url"),
        user_id: searchParams.get("user_id"),
      }),
    });
  } catch (error) {
    console.log(error);
    url = "/";
  }
  redirect(url);
}
