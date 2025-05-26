import type { z } from "zod";
import type { Entity } from "./Entity";
import { ProjectService } from "./project/service";
import { TaskService } from "./task/service";
import { UserService } from "./user/service";

export type EntityMetadata<
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>
> = {
  apiPrefix: string;
  singular: string;
  plural: string;
  fields: {
    [column in keyof T]: {
      label: string;
      constant?: boolean;
      optional?: boolean;
      type: DBType;
      fkMetadata?: EntityMetadata<Entity, any>;
      restrictedOptions?: object;
    };
  };
  relations?: Array<{
    label: string;
    fkServiceEntity: keyof typeof ServiceRegistry;
    fkField: string;
  }>,
  formSchema: TSchema;
};

export const ServiceRegistry = {
  user: UserService,
  task: TaskService,
  project: ProjectService,
};

export type DBType = 
  | "key"
  | "many_to_one"
  | "one_to_many"
  //| "enum"
  //| "datetime"
  //| "date"
  //| "number"
  //| "decimal"
  //| "string"
  | "text"
  | "boolean"
  //| "char";

export const getDefaultDBTypeValue = (type: DBType, optional?: boolean) => {
  if (optional) {
    return null;
  }
  switch (type) {
    case "key":
      return 0;
    case "many_to_one":
      return {};
    case "one_to_many":
      return [];
    case "text":
      return "";
    case "boolean":
      return false;
  }
};
