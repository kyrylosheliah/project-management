import type { Project } from "../entities/project/Project.type";
import type { Task } from "../entities/task/Task.type";
import type { User } from "../entities/user/User.type";

export interface HasId {
  id: number;
}

export type Entity = HasId | Project | Task | User;