import { Role } from "@prisma/client";

export const roles = {
  coach: Role.COACH,
  admin: Role.ADMIN,
  student: Role.STUDENT,
};
