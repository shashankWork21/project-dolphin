import { z } from "zod";

export const createUserWithPasswordSchema = z.object({
  password: z
    .string()
    .regex(/^(?=.*[a-z])/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/^(?=.*\d)/, {
      message: "Password must contain at least one number.",
    })
    .regex(/^(?=.*[@$!%*?&])/, {
      message: "Password must contain at least one special character.",
    })
    .regex(/^(?!.*(\d)\1)/, {
      message: "Password must not have consecutive identical digits.",
    })
    .regex(/^[^\s]{8,}$/, {
      message:
        "Password must be at least 8 characters long and must not contain spaces.",
    }),
  firstName: z.string().min(1, { message: "First Name cannot be empty" }),
  lastName: z.string().min(1, { message: "Last Name cannot be empty" }),
  email: z.string().email({ message: "Invalid email" }),
});

export const userSchema = z.object({
  firstName: z.string().min(1, { message: "First Name cannot be empty" }),
  lastName: z.string().min(1, { message: "Last Name cannot be empty" }),
});
