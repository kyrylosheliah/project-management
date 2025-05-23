import type { Metadata } from "../Metadata";
import { taskMetadata } from "../task/metadata";
import { userMetadata } from "../user/metadata";
import type { Project } from "./type";

export const projectMetadata: Metadata<Project> = {
  label: "Project",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", optional: true },
    owner: {
      label: "Owner",
      type: "foreign_key",
      fkMetadata: userMetadata,
    },
    tasks: {
      label: "Tasks",
      type: "this_key_reference",
      fkMetadata: taskMetadata,
    },
  },
};