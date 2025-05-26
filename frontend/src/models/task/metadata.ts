import type { EntityMetadata } from "../EntityMetadata";
import { ProjectMetadata } from "../project/metadata";
import { UserMetadata } from "../user/metadata";
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
    description: { label: "Description", type: "text", optional: true },
    projectId: {
      label: "Project",
      type: "many_to_one",
      fkMetadata: ProjectMetadata,
    },
    assigneeId: {
      label: "Assignee",
      type: "many_to_one",
      optional: true,
      fkMetadata: UserMetadata,
    },
    status: {
      label: "Task status",
      type: "text",
      restrictedOptions: TaskStatusOptions,
    },
  },
  formSchema: TaskFormSchema,
};
