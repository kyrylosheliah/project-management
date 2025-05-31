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
      type: "many_to_one",
      apiPrefix: "/project",
    },
    assigneeId: {
      label: "Assignee",
      type: "many_to_one",
      nullable: true,
      apiPrefix: "/user",
    },
    status: {
      label: "Task status",
      type: "enum",
      restrictedOptions: TaskStatusOptions,
    },
  },
  formSchema: TaskFormSchema,
  peekComponent: TaskBadge,
};
