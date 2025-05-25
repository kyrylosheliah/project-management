import { z } from "zod";
import { TaskStatusOptions } from "./field-status";
import type { Task } from "./type";

export const TaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  projectId: z.number({ required_error: "OwnerIsRequired" }),
  assigneeId: z.number().nullable(),
  status: z.nativeEnum(TaskStatusOptions),
});

export type TaskFormValues = z.infer<typeof TaskSchema>;

export const getTaskFormValues = (t: Task) => {
  const temp: any = { ...t };
  delete temp.id;
  return temp as TaskFormValues;
};
