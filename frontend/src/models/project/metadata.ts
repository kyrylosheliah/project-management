import type { Metadata } from "../Metadata";
import { taskMetadata } from "../task/metadata";
import { userMetadata } from "../user/metadata";
import type { Project } from "./type";

export const projectMetadata: Metadata<Project> = {
  label: "Project",
  apiPrefix: "/project",
  plural: "projects",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", optional: true },
    owner: {
      label: "Owner",
      type: "many_to_one",
      fkMetadata: userMetadata,
    },
    tasks: {
      label: "Tasks",
      type: "one_to_many",
      fkMetadata: taskMetadata,
    },
  },
};