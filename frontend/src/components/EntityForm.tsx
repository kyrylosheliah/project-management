import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { Entity } from "../entities/Entity";
import { ProjectService } from "../entities/project/service";
import type EntityService from "../entities/EntityService";
import ButtonText from "./ButtonText";
import { EntityFormField } from "./EntityFormField";

export const EntityForm = <
  T extends Entity,
  TSchema extends z.ZodObject<z.ZodRawShape>
>(params: {
  edit?: boolean;
  entity: T;
  service: EntityService<T, TSchema>,
}) => {
  const metadata = ProjectService.metadata;

  const defaultFormFields = params.service.getFormFields(params.entity);

  type EntityFormValues = z.infer<typeof metadata.formSchema>;

  const form = useForm<EntityFormValues>({
    resolver: zodResolver(metadata.formSchema),
    defaultValues: defaultFormFields,
  });

  const queryClient = useQueryClient();
  const mutation = useMutation<any, Error, EntityFormValues>({
    mutationFn: (newValues: EntityFormValues): Promise<any> =>
      params.service.put(params.entity.id, newValues),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`${metadata.apiPrefix}/${params.entity.id}`] });
      alert(`${metadata.singular} updated!`);
      form.reset();
    },
    onError: () => {
      alert("Failed to update the project.");
    }
  });

  const RootTag = params.edit ? "form" : "div";

  const onSubmit = params.edit
    ? form.handleSubmit((newFields: EntityFormValues) => {
        console.log("onSubmit");
        mutation.mutate(newFields);
      })
    : undefined;

  return (
    <RootTag
      onSubmit={onSubmit}
      className="flex flex-col gap-3 text-align-start"
    >
      {Object.keys(defaultFormFields).map((keyString: string) => (
        <EntityFormField
          edit={params.edit}
          key={`entity_form_field_${keyString}`}
          form={form}
          fieldKey={keyString as keyof EntityFormValues}
          service={params.service}
        />
      ))}
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
    </RootTag>
  );
};