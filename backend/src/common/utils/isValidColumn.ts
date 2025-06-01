import { getMetadataArgsStorage } from 'typeorm';

export const isValidColumn = <T>(entity: Function, field: string): boolean => {
  const columns = getMetadataArgsStorage()
    .columns.filter((col) => col.target === entity)
    .map((col) => col.propertyName);

  return columns.includes(field);
};
