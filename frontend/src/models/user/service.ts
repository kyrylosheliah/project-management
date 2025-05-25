import EntityService from "../EntityService";
import { getUserFormValues } from "./form";
import { userMetadata } from "./metadata";

export const UserService = new EntityService(
  userMetadata,
  getUserFormValues,
);