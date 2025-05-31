import { z } from "zod";

export const ProjectFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  ownerId: z.number({ required_error: "OwnerIsRequired" }),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;