import type { Task } from "../task/type";
import type { User } from "../user/type";

export type Project = {
  id: number;
  title: string;
  description: string | null;
  owner: User | null;
  tasks: Task[];
};
