import type { EntityMetadata } from "../EntityMetadata";
import { ProjectFormSchema } from "./form";
import type { Project } from "./type";

export const ProjectMetadata: EntityMetadata<
  Project,
  typeof ProjectFormSchema
> = {
  apiPrefix: "/project",
  singular: "Project",
  plural: "projects",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    title: { label: "Title", type: "text" },
    description: { label: "Description", type: "text", optional: true },
    ownerId: {
      label: "Owner",
      type: "many_to_one",
      apiPrefix: "/user",
    },
  },
  relations: [
    {
      label: "Tasks",
      apiPrefix: "/task",
      fkField: "projectId",
    },
  ],
  formSchema: ProjectFormSchema,
};