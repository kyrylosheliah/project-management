import 'reflect-metadata';

export const SEARCHABLE_METADATA_KEY = 'searchable_fields';

export type SearchMatchType = 'exact' | 'partial' | 'prefix' | 'suffix';

export interface SearchableOptions {
  weight?: number;
  type?: SearchMatchType;
}

export interface FieldSearchMetadata {
  key: string;
  weight: number;
  type: SearchMatchType;
}

export function Searchable(options: SearchableOptions = {}) {
  return function (target: any, propertyKey: string) {
    const existingFields = Reflect.getMetadata(SEARCHABLE_METADATA_KEY, target.constructor) || [];
    const fieldConfig: FieldSearchMetadata = {
      key: propertyKey,
      weight: options.weight || 1,
      type: options.type || 'partial'
    };
    
    Reflect.defineMetadata(
      SEARCHABLE_METADATA_KEY, 
      [...existingFields, fieldConfig], 
      target.constructor
    );
  };
}