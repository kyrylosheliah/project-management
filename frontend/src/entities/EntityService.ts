import type { z } from "zod";
import { type SearchParams, type SearchResponse } from "../types/Search";
import { emitHttp, emitHttpJson } from "../utils/http";
import { type Entity } from "./Entity";
import { type EntityMetadata } from "./EntityMetadata";
import type { ProjectFormValues } from "./project/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default class EntityService<
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
> {
  constructor(readonly metadata: EntityMetadata<T, TSchema>) {}

  getFormFields(entity: T): TSchema {
    const temp: any = { ...entity };
    delete temp.id;
    return temp as TSchema;
  }

  async search(search: SearchParams): Promise<SearchResponse<T>> {
    return emitHttpJson("POST", `${this.metadata.apiPrefix}/search`, search)
      .then((res) => res.json())
      .catch((reason) => {
        alert(`Failed to search for ${this.metadata.plural}, ${reason}`);
        return [];
      });
  }

  async get(entityId: string | number): Promise<T | undefined> {
    return emitHttp("GET", `${this.metadata.apiPrefix}/${entityId}`)
      .then((res) => res.json())
      .catch((reason) => {
        alert(
          `Failed to load ${this.metadata.singular} ${entityId}, ${reason}`
        );
      });
  }

  async create(data: TSchema): Promise<boolean> {
    return emitHttpJson("POST", this.metadata.apiPrefix, data)
      .then((_) => true)
      .catch((reason) => {
        alert(`Failed to create a ${this.metadata.singular}, ${reason}`);
        return false;
      });
  }

  async update(id: string | number, data: ProjectFormValues): Promise<boolean> {
    return emitHttpJson("put", `${this.metadata.apiPrefix}/${id}`, data)
      .then((_) => true)
      .catch((reason) => {
        alert(`Failed to update ${this.metadata.singular} ${id}, ${reason}`);
        return false;
      });
  }

  async delete(entityId: string | number): Promise<void> {
    if (!confirm("Are you sure you want to delete this project?")) return;
    emitHttpJson("DELETE", `${this.metadata.apiPrefix}/${entityId}`).catch(
      (reason) => {
        alert(`Failed to delete the ${this.metadata.singular}, ${reason}`);
      }
    );
  }

  useSearch(searchParams: SearchParams) {
    return useQuery({
      queryKey: [this.metadata.apiPrefix, "search", searchParams],
      queryFn: () => this.search(searchParams),
      placeholderData: (prev) => prev,
    });
  }

  useGet(entityId: string | number) {
    return useQuery({
      queryKey: [this.metadata.apiPrefix, "get", entityId],
      queryFn: () => this.get(entityId),
      enabled: !!entityId,
    });
  }

  useCreate(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (data: TSchema) => this.create(data),
      onSuccess: () => {
        onSuccess?.();
        queryClient.invalidateQueries({
          queryKey: [this.metadata.apiPrefix, "search"],
        });
      },
    });
  }

  useUpdate(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: ProjectFormValues }) =>
        this.update(id, data),
      onSuccess: (_, variables) => {
        onSuccess?.();
        queryClient.invalidateQueries({
          queryKey: [this.metadata.apiPrefix, "search"],
        });
        queryClient.invalidateQueries({
          queryKey: [this.metadata.apiPrefix, "get", variables.id],
        });
      },
    });
  }

  useDelete(onSuccess?: () => void) {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id }: { id: number }) =>
        this.delete(id),
      onSuccess: (_, variables) => {
        onSuccess?.();
        queryClient.invalidateQueries({
          queryKey: [this.metadata.apiPrefix, "search"],
        });
        queryClient.invalidateQueries({
          queryKey: [this.metadata.apiPrefix, "get", variables.id],
        });
      },
    });
  }
}
