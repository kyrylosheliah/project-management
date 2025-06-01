import EntityService from "../../services/entity/EntityService";
import { UserMetadata } from "./User.metadata";

export const UserService = new EntityService(UserMetadata);