import EntityService from "../EntityService";
import { getTaskFormValues } from "./form";
import { taskMetadata } from "./metadata";

export const TaskService = new EntityService(
  taskMetadata,
  getTaskFormValues,
);