import { z } from "zod";
import type { User } from "./User.type";

export const UserFormSchema: z.ZodType<Omit<User, 'id'>>  = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
});

export type UserFormValues = z.infer<typeof UserFormSchema>;