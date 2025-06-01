import type { EntityMetadata } from "../../types/EntityMetadata";
import { UserBadge } from "./UserBadge";
import { UserFormSchema } from "./User.form";
import type { User } from "./User.type";

export const UserMetadata: EntityMetadata<
  User,
  typeof UserFormSchema
> = {
  apiPrefix: "/user",
  indexPagePrefix: "/users",
  singular: "User",
  plural: "users",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    name: { label: "Name", type: "text" },
    email: { label: "Email", type: "text" },
  },
  relations: [
    {
      label: "Manages Projects",
      apiPrefix: "/project",
      fkField: "ownerId",
    },
    {
      label: "Assigned Tasks",
      apiPrefix: "/task",
      fkField: "assigneeId",
    },
  ],
  formSchema: UserFormSchema,
  peekComponent: UserBadge,
};