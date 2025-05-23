import type { Project } from "../project/type";
import type { User } from "../user/type";
import type { TaskStatus } from "./field-status";

export type Task = {
  id: number;
  title: string;
  description: string | null;
  project: Project;
  assignedTo: User | null;
  status: TaskStatus;
};