import { z } from "zod";
import type { Entity } from "../entities/Entity";
import { getZodDefaults } from "../utils/getZodDefaults";

export const SearchSchema = z.object({
  pageNo: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(20).default(10),
  ascending: z.coerce.boolean().default(true),
  orderByColumn: z.string().default('id'),
  criteria: z.record(z.any()).default({}),
});

export type SearchParams = z.infer<typeof SearchSchema>;

export const defaultSearchParams: SearchParams = getZodDefaults(SearchSchema) as SearchParams;

export type SearchResponse<T extends Entity> = {
  pageCount: number;
  items: T[],
};