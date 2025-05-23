import type { Metadata } from "../Metadata";
import { userMetadata } from "../user/metadata";
import { TaskStatusOptions, type TaskStatus } from "./field-status";

export const taskMetadata: Metadata<Task> = {
  label: "Task",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", optional: true },
    projectId: { label: "Project", type: "foreign_key" },
    assignedToId: {
      label: "Assignee",
      type: "foreign_key",
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

export type Task = {
  id: number;
  title: string;
  description: string | null;
  projectId: number;
  assignedToId: number | null;
  status: TaskStatus;
};