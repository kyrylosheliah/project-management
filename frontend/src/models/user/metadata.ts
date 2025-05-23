import type { Metadata } from "../Metadata";
import type { User } from "./type";

export const userMetadata: Metadata<User> = {
  label: "User",
  fields: {
    id: { label: "Id", type: "key", constant: true },
    name: { label: "Name", type: "text" },
  },
};