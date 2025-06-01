import EntityService from "../../services/entity/EntityService";
import { ProjectMetadata } from "./Project.metadata";

export const ProjectService = new EntityService(ProjectMetadata);