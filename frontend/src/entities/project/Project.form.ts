import { z } from "zod";
import type { Project } from "./Project.type";

export const ProjectFormSchema: z.ZodType<Omit<Project, 'id'>> = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  ownerId: z.number({ required_error: "OwnerIsRequired" }),
});

export type ProjectFormValues = z.infer<typeof ProjectFormSchema>;