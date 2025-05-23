export type Metadata<T> = {
  label: string;
  fields: FieldsMetadata<T>;
}

export type FieldsMetadata<T> = {
  [column in keyof T]: {
    label: string;
    constant?: boolean;
    optional?: boolean;
    type: DBType;
    fkMetadata?: Metadata<any>;
    restrictedOptions?: object;
  };
};

export type DBType = 
  | "key"
  | "foreign_key"
  | "this_key_reference"
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
      break;
    case "foreign_key":
      return 0;
      break;
    case "this_key_reference":
      return [];
      break;
    case "text":
      return "";
      break;
    case "boolean":
      return false;
      break;
  }
}