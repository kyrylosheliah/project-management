import type { SearchParams, SearchResponse } from "../types/Search";
import { emitHttpJson } from "../utils/http";
import { type Entity } from "./Entity";

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