import type { Project } from "./project/type";
import type { Task } from "./task/type";
import type { User } from "./user/type";

export interface HasId {
  id: number;
}

export type Entity = HasId | Project | Task | User;
