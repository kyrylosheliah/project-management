import { z } from "zod";

export const UserFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email(),
});

export type UserFormValues = z.infer<typeof UserFormSchema>;