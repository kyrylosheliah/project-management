import { useWatch, type FieldValues, type Path, type UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { fieldMetadataInitialValue, type DatabaseType } from "../../entities/EntityMetadata";
import type { Entity } from "../../entities/Entity";
import ButtonIcon from "../../ui/ButtonIcon";
import type EntityService from "../../entities/EntityService";
import { EntityServiceRegistry } from "../../entities/EntityServiceRegistry";
import { EntityFieldDisplay } from "./FieldDisplay";
import { useState } from "react";
import { cx } from "../../utils/cx";
import { EntityTable } from "./Table";
import { type SearchParams, defaultSearchParams } from "../../types/Search";
import { Checkbox } from "../../ui/Checkbox";
import { IconPlus } from "../../ui/icons/Plus";
import { IconClose } from "../../ui/icons/Close";
import { IconNull } from "../../ui/icons/Null";

export const EntityFormField = <
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  EntityFormValues extends FieldValues
>(params: {
  edit?: boolean;
  service: EntityService<T, TSchema>;
  form: UseFormReturn<EntityFormValues>;
  fieldKey: (keyof EntityFormValues) & (keyof T) & Path<EntityFormValues>;
}) => {
  const metadata = params.service.metadata;

  const errors = params.form.formState.errors;

  const fieldMetadata = params.service.metadata.fields[params.fieldKey];
  
  const initialValue = (params.form.formState.defaultValues !== undefined
    && params.form.formState.defaultValues[params.fieldKey] as any)
      || fieldMetadataInitialValue(fieldMetadata);

  const keyOrConst =
    fieldMetadata.constant === true || fieldMetadata.type === "key";

  const fieldValue = useWatch({
    control: params.form.control,
    name: params.fieldKey,
  });

  return (
    <div>
      <div className="gap-2 flex flex-row items-center">
        <label
          htmlFor={params.fieldKey.toString()}
          children={metadata.fields[params.fieldKey].label}
          className="block text-sm fw-700 text-gray-900"
        />
        <EntityFieldIcon fieldType={metadata.fields[params.fieldKey].type} />
        {params.edit && !keyOrConst && fieldMetadata.nullable === true && (
          <ButtonIcon
            className="w-6 h-6"
            children={fieldValue === null ? <IconPlus /> : <IconClose />}
            props={{
              type: "button",
              onClick: () =>
                params.form.setValue(
                  params.fieldKey,
                  fieldValue === null ? initialValue : null
                ),
            }}
          />
        )}
      </div>
      {params.edit ? (
        <EntityFieldControl
          fieldKey={params.fieldKey}
          form={params.form}
          service={params.service}
        />
      ) : (
        <EntityFieldDisplay
          fieldKey={params.fieldKey}
          fieldValue={params.form.getValues(params.fieldKey)}
          service={params.service}
        />
      )}
      {errors[params.fieldKey] && (
        <p className="text-red-600 text-xs m-0">
          {errors[params.fieldKey]?.message?.toString()}
        </p>
      )}
    </div>
  );
}

const EntityFieldIcon = (params: {
  fieldType: DatabaseType
}) => {
  let children: any;
  switch (params.fieldType) {
    case "key":
      children = "KEY";
      break;
    case "boolean":
      children = "Y/N";
      break;
    case "text":
      children = "TXT";
      break;
    case "many_to_one":
      children = "FK";
      break;
  }
  return (
    <ButtonIcon
      props={{
        type: "button",
        disabled: true,
      }}
      className="w-6 h-6 text-xs"
      children={children}
    />
  );
};

const EntityFieldInput = <
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  EntityFormValues extends FieldValues,
>(params: {
  fieldKey: (keyof EntityFormValues) & (keyof T) & Path<EntityFormValues>;
  form: UseFormReturn<EntityFormValues>;
  service: EntityService<T, TSchema>;
}) => {
  const errors = params.form.formState.errors;
  const isDirty: boolean | undefined = (
    params.form.formState.dirtyFields as any
  )[params.fieldKey];
  const commonClasses = cx(
    "border w-full",
    errors[params.fieldKey]
      ? "border-red-400"
      : isDirty
        ? "border-yellow-600"
        : "border-gray-300"
  );
  const fieldMetadata = params.service.metadata.fields[params.fieldKey];
  const disabled = fieldMetadata.constant || fieldMetadata.type === "key";
  const fieldValue = params.form.getValues(params.fieldKey);
  switch (fieldMetadata.type) {
    case "key":
      return (
        <input
          {...params.form.register(params.fieldKey)}
          disabled={disabled}
          className={cx(commonClasses)}
        />
      );
    case "boolean":
      return (
        <Checkbox
          attributes={{
            ...params.form.register(params.fieldKey),
            disabled,
          }}
          className={cx(commonClasses)}
        />
      );
    case "text":
      return (
        <textarea
          {...params.form.register(params.fieldKey)}
          disabled={disabled}
          className={cx(commonClasses)}
        />
      );
    case "many_to_one":
      const [searchParams, setSearchParams] =
        useState<SearchParams>(defaultSearchParams);
      const entityIdState = useState<number | null>(fieldValue);
      return (
        <EntityTable
          service={EntityServiceRegistry[fieldMetadata.apiPrefix!] as any}
          searchParams={{ value: searchParams, set: setSearchParams }}
          pickerState={entityIdState}
          className={cx(commonClasses)}
        />
      );
    case "enum":
      return (
        <select className={cx(commonClasses)}>
          {Object.entries(fieldMetadata.restrictedOptions!).map(
            ([key, value]) => (
              <option value={value}>{key}</option>
            )
          )}
        </select>
      );
    default:
      return (<div>unimplemented_input</div>);
  }
};

const EntityFieldControl = <
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>,
  EntityFormValues extends FieldValues,
>(params: {
  fieldKey: (keyof EntityFormValues) & (keyof T) & Path<EntityFormValues>;
  form: UseFormReturn<EntityFormValues>;
  service: EntityService<T, TSchema>;
}) => {
  const fieldValue = useWatch({
    control: params.form.control,
    name: params.fieldKey,
  });

  return (
    <div className="flex flex-row gap-4">
      {fieldValue !== null ? (
        <EntityFieldInput
          {...params}
        />
      ) : (
        <ButtonIcon
          props={{
            type: "button",
            disabled: true,
          }}
          className="w-8 h-8"
          children={<IconNull />}
        />
      )}
    </div>
  );
};