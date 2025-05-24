import type { SearchParams, SearchResponse } from "../types/Search";
import { emitHttpJson } from "../utils/http";
import type { Project } from "./project/type";
import type { Task } from "./task/type";
import type { User } from "./user/type";

export interface HasId {
  id: number;
}

export type Entity = HasId | Project | Task | User;

export const searchEntities = async <T extends Entity,>(
  search: SearchParams,
  path: string,
): Promise<SearchResponse<T>> =>
  emitHttpJson("POST", path, search)
    .then((res) => res.json())
    .catch((reason) => {
      alert(`Failed to load entities from ${path}, ${reason}`);
      return [];
    });