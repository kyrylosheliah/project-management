import type { EntityMetadata } from "../../types/EntityMetadata";
import { ProjectBadge } from "./ProjectBadge";
import { ProjectFormSchema } from "./Project.form";
import type { Project } from "./Project.type";

export const ProjectMetadata: EntityMetadata<
  Project,
  typeof ProjectFormSchema
> = {
  apiPrefix: "/project",
  indexPagePrefix: "/projects",
  singular: "Project",
  plural: "projects",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", nullable: true },
    ownerId: {
      label: "Owner",
      type: "fkey",
      apiPrefix: "/user",
    },
  },
  relations: [
    {
      label: "Has tasks",
      apiPrefix: "/task",
      fkField: "projectId",
    },
  ],
  formSchema: ProjectFormSchema,
  peekComponent: ProjectBadge,
};