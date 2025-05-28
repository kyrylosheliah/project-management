import { UserService } from "./user/service";
import { TaskService } from "./task/service";
import { ProjectService } from "./project/service";

export const EntityServiceRegistry = {
  "/user": UserService,
  "/task": TaskService,
  "/project": ProjectService,
};