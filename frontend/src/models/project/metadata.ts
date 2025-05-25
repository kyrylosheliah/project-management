import type { Metadata } from "../Metadata";
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
    ownerId: {
      label: "Owner",
      type: "many_to_one",
      fkMetadata: userMetadata,
    },
  },
};