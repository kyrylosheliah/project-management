import type { EntityMetadata } from "../EntityMetadata";
import { TaskBadge } from "./badge";
import { TaskStatusOptions } from "./field-status";
import { TaskFormSchema } from "./form";
import type { Task } from "./type";

export const TaskMetadata: EntityMetadata<
  Task,
  typeof TaskFormSchema
> = {
  apiPrefix: "/task",
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
