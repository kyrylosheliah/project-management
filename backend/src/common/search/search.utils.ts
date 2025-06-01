import { FieldSearchMetadata, SEARCHABLE_METADATA_KEY } from './searchable.decorator';

export function getSearchableFields(entity: any): FieldSearchMetadata[] {
  return Reflect.getMetadata(SEARCHABLE_METADATA_KEY, entity) || [];
}
