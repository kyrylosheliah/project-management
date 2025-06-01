import EntityService from "../../services/entity/EntityService";
import { TaskMetadata } from "./Task.metadata";

export const TaskService = new EntityService(TaskMetadata);