import type { EntityMetadata } from "../EntityMetadata";
import { UserBadge } from "./badge";
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
    email: { label: "Email", type: "text" },
  },
  relations: [
    {
      label: "Managing Projects",
      apiPrefix: "/project",
      fkField: "ownerId",
    },
    {
      label: "Assigned Projects",
      apiPrefix: "/task",
      fkField: "assigneeId",
    },
  ],
  formSchema: UserFormSchema,
  peekComponent: UserBadge,
};