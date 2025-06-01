import { z } from "zod";
import { taskStatusKeys } from "./TaskStatus";
import type { Task } from "./Task.type";


export const TaskFormSchema: z.ZodType<Omit<Task, 'id'>>  = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  projectId: z.number({ required_error: "OwnerIsRequired" }),
  assigneeId: z.number().nullable(),
  status: z.enum(taskStatusKeys),
});

export type TaskFormValues = z.infer<typeof TaskFormSchema>;