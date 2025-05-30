import type { z } from "zod";
import { SearchSchema, searchStatesToParameters, type SearchParams, type SearchResponse } from "../types/Search";
import { emitHttp, emitHttpJson } from "../utils/http";
import { type Entity } from "./Entity";
import { type EntityMetadata } from "./EntityMetadata";
import type { ProjectFormValues } from "./project/form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import type { PaginationState, SortingState } from "@tanstack/react-table";

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

  async post(data: TSchema): Promise<boolean> {
    return emitHttpJson("POST", this.metadata.apiPrefix, data)
      .then((_) => true)
      .catch((reason) => {
        alert(`Failed to create a ${this.metadata.singular}, ${reason}`);
        return false;
      });
  }

  async put(id: number, data: ProjectFormValues): Promise<boolean> {
    return emitHttpJson("put", `${this.metadata.apiPrefix}/${id}`, data)
      .then((_) => true)
      .catch((reason) => {
        alert(`Failed to update ${this.metadata.singular} ${id}, ${reason}`);
        return false;
      });
  }

  async delete(entityId: number): Promise<void> {
    if (!confirm("Are you sure you want to delete this project?")) return;
    emitHttpJson("DELETE", `${this.metadata.apiPrefix}/${entityId}`).catch(
      (reason) => {
        alert(`Failed to delete the ${this.metadata.singular}, ${reason}`);
      }
    );
  }

  useSearch(params: {
    defaultValue: SearchParams;
    relationFilter?: { key: string; value: any };
    controlled?: {
      value: SearchParams;
      set: (nextSearch: SearchParams) => void;
    };
  }) {
    const sourceParameters = params.controlled === undefined
      ? params.defaultValue
      : params.controlled.value;

    const [pagination, setPagination] = useState<PaginationState>({
      pageIndex: sourceParameters.pageNo - 1,
      pageSize: 2// sourceParameters.pageSize || 10,
    });

    const [sorting, setSorting] = useState<SortingState>([
      {
        id: sourceParameters.orderByColumn,
        desc: !sourceParameters.ascending,
      },
    ]);

    const [globalFilter, setGlobalFilter] = useState<string>("");

    const createSearchParams = () => {
      let nextSearch = searchStatesToParameters({
        pagination,
        sorting,
        globalFilter,
      });
      if (params.relationFilter) {
        nextSearch.criteria[params.relationFilter.key] =
          params.relationFilter.value;
      }
      const result = SearchSchema.safeParse(nextSearch);
      if (!result.success) {
        console.log(result.error.format());
        console.log(nextSearch);
        alert(`Invalid search parameters, ${result.error.format()}`);
        return params.controlled === undefined
          ? params.defaultValue
          : params.controlled.value;
      }
      return nextSearch;
    };

    const query = useQuery({
      queryKey: [
        this.metadata.apiPrefix,
        "search",
        globalFilter,
        pagination,
        sorting,
      ],
      queryFn: () => this.search(createSearchParams()),
      enabled: true,
      placeholderData: (prev) => prev,
    });

    return {
      searchParams: {
        createSearchParams,
        pagination,
        setPagination,
        sorting,
        setSorting,
        globalFilter,
        setGlobalFilter,
      },
      query,
    };
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
      mutationFn: (data: TSchema) => this.post(data),
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
        this.put(id, data),
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
      mutationFn: ({ id, data }: { id: number; data: ProjectFormValues }) =>
        this.put(id, data),
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
