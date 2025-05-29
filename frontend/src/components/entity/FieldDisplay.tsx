import { useQuery } from "@tanstack/react-query";
import type { FieldValues, Path } from "react-hook-form";
import type { z } from "zod";
import type { Entity } from "../../entities/Entity";
import type { EntityFieldMetadata } from "../../entities/EntityMetadata";
import type EntityService from "../../entities/EntityService";
import { EntityServiceRegistry } from "../../entities/EntityServiceRegistry";
import ButtonIcon from "../../ui/ButtonIcon";

export const EntityFieldDisplay = <
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  EntityFormValues extends FieldValues,
>(params: {
  fieldKey: (keyof EntityFormValues) & (keyof T) & Path<EntityFormValues>;
  fieldValue: any;
  service: EntityService<T, TSchema>;
}) => {
  const fieldMetadata = params.service.metadata.fields[params.fieldKey]
  //const fieldValue = params.form.getValues(params.fieldKey);
  if (fieldMetadata.optional) {
    //if (params.form.getValues(params.fieldKey) === null) {
    if (params.fieldValue === null) {
      return NullEntityFieldIcon;
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
    case "many_to_one":
      return <EntityFkField fkId={params.fieldValue} fieldMetadata={fieldMetadata} />;
    //case "one_to_many":
    default:
      throw new Error("Unimplemented type display");
  }
};

const NullEntityFieldIcon = (<ButtonIcon
  className="w-6 h-6"
  children="?"
/>);

const EntityFkField = (params: {
  fkId: number;
  fieldMetadata: EntityFieldMetadata;
}) => {
  const fkService = EntityServiceRegistry[params.fieldMetadata.apiPrefix!];
  const fkMetadata = fkService.metadata;
  const { data, isPending } = useQuery<any>({
    queryKey: [`${fkMetadata.apiPrefix}/${params.fkId}`],
    queryFn: () => fkService.get(params.fkId),
  });
  const loadingElement = <div>...</div>;
  return isPending || data === undefined ? (
    loadingElement
  ) : (
    <div>{fkMetadata.peekComponent(data)}</div>
  );
};
