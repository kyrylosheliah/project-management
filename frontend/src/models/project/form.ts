import { z } from "zod";
import type { Project } from "./type";

export const ProjectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  ownerId: z.number({ required_error: "OwnerIsRequired" }),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;

export const getProjectFormValues = (p: Project) => {
  const temp: any = { ...p };
  delete temp.id;
  return temp as ProjectFormValues;
};