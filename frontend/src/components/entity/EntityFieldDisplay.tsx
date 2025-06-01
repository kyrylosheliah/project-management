import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import type { FieldValues, Path } from "react-hook-form";
import type { z } from "zod";
import type { EntityFieldMetadata } from "../../types/EntityMetadata";
import type EntityService from "../../services/entity/EntityService";
import { EntityServiceRegistry } from "../../services/entity/EntityServiceRegistry";
import { IconLink } from "../icons/Link";
import { IconNull } from "../icons/Null";
import { BadgeIcon } from "../ui/BadgeIcon";
import ButtonIcon from "../ui/ButtonIcon";
import { Popover } from "../ui/Popover";
import { EntityForm } from "./EntityForm";
import type { Entity } from "../../types/Entity";

export const EntityFieldDisplay = <
  T extends Entity,
  TSchema extends z.ZodType<Omit<T, 'id'>>,
  EntityFormValues extends FieldValues,
>(params: {
  fieldKey: (keyof EntityFormValues) & (keyof T) & Path<EntityFormValues>;
  fieldValue: any;
  service: EntityService<T, TSchema>;
  breakPopover?: boolean;
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
      return <div className="max-w-xs break-words">{params.fieldValue}</div>;
    case "fkey":
      return (
        <EntityFkField
          fkId={params.fieldValue}
          fieldMetadata={fieldMetadata}
          breakPopover={params.breakPopover}
        />
      );
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
  breakPopover?: boolean;
}) => {
  const router = useRouter();
  if (params.fkId === 0) {
    return (
      <BadgeIcon
        className="fw-700"
        children={<div className="px-2">unspecified</div>}
      />
    );
  }
  const fkService = EntityServiceRegistry[params.fieldMetadata.apiPrefix!];
  const fkMetadata = fkService.metadata;
  const { data, isPending } = fkService.useGet(params.fkId);
  const loadingElement = <div>...</div>;
  const [popoverOpen, setPopoverOpen] = useState<boolean>(false);
  return isPending || data === undefined ? (
    loadingElement
  ) : params.breakPopover ? (
    fkMetadata.peekComponent(data as any)
  ) : (
    <Popover
      hover
      stickyParent
      controlled={[popoverOpen, setPopoverOpen]}
      coord={{ x: "center", y: "end" }}
      target={fkMetadata.peekComponent(data as any)}
      popover={
        <div className="z-20 inline-block bg-white border rounded-md shadow-md flex flex-row items-start">
          <div className="py-4 pl-4">
            <EntityForm
              edit={false}
              entity={data as any}
              onSubmit={() => {}}
              service={fkService as any}
              breakPopover
            />
          </div>
          <ButtonIcon
            children={<IconLink />}
            props={{
              className: "mr-1 mt-1",
              onClick: () =>
                router.navigate({
                  to: `${fkMetadata.indexPagePrefix}/${params.fkId}`,
                }),
            }}
          />
        </div>
      }
    />
  );
};
