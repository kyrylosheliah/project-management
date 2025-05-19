import type { Task } from "../Task";

export interface Project {
  id: number;
  title: string;
  description?: string;
  ownerId: number;
  tasks: Task[];
}
