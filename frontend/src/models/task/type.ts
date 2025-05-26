import type { TaskStatus } from "./field-status";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  projectId: number;
  assigneeId: number | null;
  status: TaskStatus;
};