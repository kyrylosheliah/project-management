import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Entity } from "../../entities/Entity";
import type EntityService from "../../entities/EntityService";
import ButtonText from "../../ui/ButtonText";
import { EntityFormField } from "./FormField";
import { useEffect } from "react";

export const EntityForm = <
  T extends Entity,
  TSchema extends z.ZodType<Omit<T, 'id'>>,
>(params: {
  edit?: boolean;
  onSubmit: (newFields: Omit<T, 'id'>) => void;
  entity: T;
  service: EntityService<T, TSchema>,
}) => {
  const metadata = params.service.metadata;

  const defaultFormFields = params.service.getFormFields(params.entity);

  const form = useForm<Omit<T, 'id'>>({
    resolver: zodResolver(metadata.formSchema),
    defaultValues: defaultFormFields as any,
  });

  useEffect(() => {
    if (params.entity) {
      form.reset(defaultFormFields);
    }
  }, [params.entity, form]);

  const RootTag = params.edit ? "form" : "div";

  const onSubmit = params.edit
    ? form.handleSubmit((newFields: Omit<T, 'id'>) => {
        console.log("onSubmit");
        params.onSubmit(newFields);
      })
    : undefined;

  return (
    <RootTag
      onSubmit={onSubmit}
      className="flex flex-col gap-3 text-align-start"
    >
      {Object.keys(defaultFormFields).map((key: string) => (
        <EntityFormField
          edit={params.edit}
          key={`entity_form_field_${key}`}
          form={form}
          fieldKey={key as any}
          service={params.service}
        />
      ))}
      {params.edit && (
        <div className="flex flex-row justify-between items-center">
          <ButtonText
            props={{
              onClick: () => form.reset(),
              className: "self-end",
            }}
          >
            Reset
          </ButtonText>
          <ButtonText
            props={{
              type: "submit",
              className: "self-end",
            }}
          >
            Apply
          </ButtonText>
        </div>
      )}
    </RootTag>
  );
};