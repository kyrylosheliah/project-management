import type { EntityMetadata } from "../EntityMetadata";
import { UserFormSchema } from "./form";
import type { User } from "./type";

export const UserMetadata: EntityMetadata<
  User,
  typeof UserFormSchema
> = {
  apiPrefix: "/user",
  singular: "User",
  plural: "users",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    name: { label: "Name", type: "text" },
  },
  relations: [
    {
      label: "Managing Projects",
      fkServiceEntity: "project",
      fkField: "ownerId",
    },
    {
      label: "Assigned Projects",
      fkServiceEntity: "task",
      fkField: "assigneeId",
    },
  ],
  formSchema: UserFormSchema,
};