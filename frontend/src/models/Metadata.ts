import type { Entity } from "./Entity";

export type Metadata<T extends Entity> = {
  apiPrefix: string;
  singular: string;
  plural: string;
  fields: FieldsMetadata<T>;
}

export type FieldsMetadata<T> = {
  [column in keyof T]: {
    label: string;
    constant?: boolean;
    optional?: boolean;
    type: DBType;
    fkMetadata?: Metadata<Entity>;
    restrictedOptions?: object;
  };
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
