import type { SearchParams, SearchResponse } from "../types/Search";
import { emitHttp, emitHttpJson } from "../utils/http";
import { type Entity } from "./Entity";
import type { Metadata } from "./Metadata";
import type { ProjectFormValues } from "./project/form";

export default class EntityService<T extends Entity, TForm> {
  constructor(
    readonly metadata: Metadata<T>,
    readonly getFormValues: (e: T) => TForm
  ) {}

  async search(
    search: SearchParams,
    path: string
  ): Promise<SearchResponse<T>> {
    return emitHttpJson("POST", path, search)
      .then((res) => res.json())
      .catch((reason) => {
        alert(`Failed to load ${this.metadata} from ${path}, ${reason}`);
        return [];
      });
  }

  async get(entityId: string): Promise<T | undefined> {
    return emitHttp("GET", `/${this.metadata.singular}/${entityId}`)
      .then((res) => res.json())
      .catch((reason) => {
        alert(
          `Failed to load ${this.metadata.singular} ${entityId}, ${reason}`
        );
      });
  }

  async post(data: TForm): Promise<boolean> {
    return emitHttpJson("POST", `/${this.metadata.singular}`, data)
      .then((_) => true)
      .catch((reason) => {
        alert(`Failed to create a ${this.metadata.singular}, ${reason}`);
        return false;
      });
  }

  async put(id: number, data: ProjectFormValues): Promise<boolean> {
    return emitHttpJson("put", `/${this.metadata.singular}/${id}`, data)
      .then((_) => true)
      .catch((reason) => {
        alert(`Failed to update ${this.metadata.singular} ${id}, ${reason}`);
        return false;
      });
  }

  async delete(entityId: number): Promise<void> {
    if (!confirm("Are you sure you want to delete this project?")) return;
    emitHttpJson("DELETE", `/${this.metadata.singular}/${entityId}`).catch(
      (reason) => {
        alert(`Failed to delete the ${this.metadata.singular}, ${reason}`);
      }
    );
  }
}
