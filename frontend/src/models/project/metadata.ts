import type { EntityMetadata } from "../EntityMetadata";
import { UserMetadata } from "../user/metadata";
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
      fkMetadata: UserMetadata,
    },
  },
  relations: [
    {
      label: "Tasks",
      fkServiceEntity: "task",
      fkField: "projectId",
    },
  ],
  formSchema: ProjectFormSchema,
};