import type { z } from "zod";
import type { Entity } from "../../entities/Entity";
import type { EntityFieldMetadata } from "../../entities/EntityMetadata";
import type EntityService from "../../entities/EntityService";
import { EntityServiceRegistry } from "../../entities/EntityServiceRegistry";
import ButtonIcon from "../../ui/ButtonIcon";
import { BadgeIcon } from "../../ui/BadgeIcon";
import { IconNull } from "../../ui/icons/Null";
import type { FieldValues, Path } from "react-hook-form";

export const EntityFieldDisplay = <
  T extends Entity,
  TSchema extends z.ZodType<Omit<T, 'id'>>,
  EntityFormValues extends FieldValues,
>(params: {
  fieldKey: (keyof EntityFormValues) & (keyof T) & Path<EntityFormValues>;
  fieldValue: any;
  service: EntityService<T, TSchema>;
}) => {
  const fieldMetadata = params.service.metadata.fields[params.fieldKey]
  if (fieldMetadata.nullable) {
    if (params.fieldValue === null) {
      return (
        <ButtonIcon
          className="w-6 h-6"
          props={{ disabled: true }}
          children={<IconNull />}
        />
      );
    }
  }
  switch (fieldMetadata.type) {
    case "key":
    //case "number":
      return `${new String(params.fieldValue)}`;
    case "boolean":
      return params.fieldValue ? "yes" : "no";
    case "text":
      return params.fieldValue;
    case "fkey":
      return <EntityFkField fkId={params.fieldValue} fieldMetadata={fieldMetadata} />;
    case "enum":
      return (
        (fieldMetadata.enum!.options as any)[params.fieldValue] ||
        params.fieldValue
      );
    default:
      return "Unimplemented type display";
  }
};

const EntityFkField = (params: {
  fkId: string | number;
  fieldMetadata: EntityFieldMetadata;
}) => {
  if (params.fkId === 0) {
    return (
      <BadgeIcon
        className="fw-700"
        children={<div className="pr-2">...</div>}
        icon={ <div className="flex justify-center items-center">?</div> }
      />
    );
  }
  const fkService = EntityServiceRegistry[params.fieldMetadata.apiPrefix!];
  const fkMetadata = fkService.metadata;
  const { data, isPending } = fkService.useGet(params.fkId);
  const loadingElement = <div>...</div>;
  return isPending || data === undefined ? (
    loadingElement
  ) : (
    <div>{fkMetadata.peekComponent(data as any)}</div>
  );
};
