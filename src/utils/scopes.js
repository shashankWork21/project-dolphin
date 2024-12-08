import { Scope } from "@prisma/client";
export const scopes = [
  { scope: Scope.CALENDAR, value: "https://www.googleapis.com/auth/calendar" },

  {
    scope: Scope.EMAIL,
    value: "https://www.googleapis.com/auth/userinfo.email",
  },
  {
    scope: Scope.PROFILE,
    value: "https://www.googleapis.com/auth/userinfo.profile",
  },

  { scope: Scope.DOCS, value: "https://www.googleapis.com/auth/documents" },
  {
    scope: Scope.SHEETS,
    value: "https://www.googleapis.com/auth/spreadsheets",
  },
  {
    scope: Scope.YOUTUBE,
    value: "https://www.googleapis.com/auth/presentations",
  },
  {
    scope: Scope.OPENID,
    value: "openid",
  },
];
