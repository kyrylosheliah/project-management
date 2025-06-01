import type { EntityMetadata } from "../../types/EntityMetadata";
import { TaskStatusOptions } from "./TaskStatus";
import { TaskFormSchema } from "./Task.form";
import type { Task } from "./Task.type";
import { TaskBadge } from "./TaskBadge";

export const TaskMetadata: EntityMetadata<
  Task,
  typeof TaskFormSchema
> = {
  apiPrefix: "/task",
  indexPagePrefix: "/tasks",
  singular: "Task",
  plural: "tasks",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", nullable: true },
    projectId: {
      label: "Project",
      type: "fkey",
      apiPrefix: "/project",
    },
    assigneeId: {
      label: "Assignee",
      type: "fkey",
      nullable: true,
      apiPrefix: "/user",
    },
    status: {
      label: "Task status",
      type: "enum",
      enum: {
        default: "todo",
        options: TaskStatusOptions,
      },
    },
  },
  formSchema: TaskFormSchema,
  peekComponent: TaskBadge,
};
