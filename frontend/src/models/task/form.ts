import { z } from "zod";
import { TaskStatusOptions } from "./field-status";

export const TaskFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  projectId: z.number({ required_error: "OwnerIsRequired" }),
  assigneeId: z.number().nullable(),
  status: z.nativeEnum(TaskStatusOptions),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;