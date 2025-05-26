import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import type { Entity } from "../models/Entity";
import { ProjectService } from "../models/project/service";
import type EntityService from "../models/EntityService";
import ButtonText from "./ButtonText";

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

  const isDirty = (key: string) =>
    form.formState.dirtyFields[key as keyof EntityFormValues];

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

  const onSubmit = (newFields: EntityFormValues) => {
    console.log("onSubmit");
    mutation.mutate(newFields);
  };
  
  return (
    <div className="">
      {params.edit ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {Object.keys(defaultFormFields).map((keyString: string) => {
            const key = keyString as keyof EntityFormValues;
            const errors = form.formState.errors;
            const borderColor = errors[key]
              ? "border-red-400"
              : isDirty(key)
                ? "border-yellow-600"
                : "border-gray-300";
            return (
              <div key={`${metadata.singular}_prop_${key}`}>
                <label
                  htmlFor={key}
                  children={key}
                  className="block mt-4 text-sm fw-700 text-gray-900"
                />
                <input
                  {...form.register(key)}
                  className={`bg-gray-50 border focus:outline-none ${borderColor} text-gray-900 text-sm rounded-lg block w-full p-2.5`}
                />
                {errors[key] && (
                  <p className="text-red-600 text-xs m-0">
                    {errors[key]?.message}
                  </p>
                )}
              </div>
            );
          })}
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
        </form>
      ) : (
        <div className="flex flex-col gap-3 text-align-start">
          {Object.entries(defaultFormFields).map(([key, value]) => (
            <div key={`${metadata.singular}_prop_${key}`}>
              <div children={key} className="text-sm fw-700" />
              <div>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};