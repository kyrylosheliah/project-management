import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Entity } from "../../entities/Entity";
import type EntityService from "../../entities/EntityService";
import ButtonText from "../../ui/ButtonText";
import { EntityFormField } from "./FormField";

export const EntityForm = <
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>
>(params: {
  edit?: boolean;
  onSubmit: (newFields: any) => void;
  entity: T;
  service: EntityService<T, TSchema>,
}) => {
  const metadata = params.service.metadata;

  type EntityFormValues = z.infer<typeof metadata.formSchema>;

  const defaultFormFields = params.service.getFormFields(params.entity);

  const form = useForm<EntityFormValues>({
    resolver: zodResolver(metadata.formSchema),
    defaultValues: defaultFormFields as any,
  });

  const RootTag = params.edit ? "form" : "div";

  const onSubmit = params.edit
    ? form.handleSubmit((newFields: EntityFormValues) => {
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
              type: "button",
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