import type { Metadata } from "../Metadata";
import { userMetadata } from "../user/metadata";
import { TaskStatusOptions } from "./field-status";
import type { Task } from "./type";

export const taskMetadata: Metadata<Task> = {
  label: "Task",
  apiPrefix: "/task",
  plural: "tasks",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", optional: true },
    project: { label: "Project", type: "many_to_one" },
    assignedTo: {
      label: "Assignee",
      type: "many_to_one",
      optional: true,
      fkMetadata: userMetadata,
    },
    status: {
      label: "Task status",
      type: "text",
      restrictedOptions: TaskStatusOptions,
    },
  },
};
