import EntityService from "../EntityService";
import { getProjectFormValues } from "./form";
import { projectMetadata } from "./metadata";

export const ProjectService = new EntityService(
  projectMetadata,
  getProjectFormValues,
);