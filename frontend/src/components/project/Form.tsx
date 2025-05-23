import { useForm } from "react-hook-form";
import type { Project } from "../../models/project/type";
import { getProjectFormValues, ProjectSchema, type ProjectFormValues } from "../../models/project/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProject } from "../../models/project/service";
import { projectMetadata } from "../../models/project/metadata";

export const ProjectForm: React.FC<{
  edit?: boolean;
  project: Project;
}> = (params) => {
  const defaultFormValues = getProjectFormValues(params.project);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
    defaultValues: defaultFormValues,
  });

  const isDirty = (key: string) =>
    form.formState.dirtyFields[key as keyof ProjectFormValues];

  const queryClient = useQueryClient();
  const mutation = useMutation<any, Error, ProjectFormValues>({
    mutationFn: (newValues: ProjectFormValues): Promise<any> =>
      updateProject(params.project.id, newValues),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/project/${params.project.id}`] });
      alert("Project updated!");
      form.reset();
    },
    onError: () => {
      alert("Failed to update the project.");
    }
  });

  const onSubmit = (newValues: ProjectFormValues) => {
    console.log("onSubmit");
    mutation.mutate(newValues);
  };
  
  return (
    <div className="p-4 p-t-4">
      {params.edit ? (
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          {Object.keys(defaultFormValues).map((keyString: string) => {
            const key = keyString as keyof ProjectFormValues;
            const errors = form.formState.errors;
            const borderColor = errors[key]
              ? "border-red-400"
              : isDirty(key)
                ? "border-yellow-600"
                : "border-gray-300";
            return (
              <div key={`${projectMetadata.label}_prop_${key}`}>
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
            <button
              onClick={() => form.reset()}
              className="self-end mt-4 px-3 py-2 text-gray-600 hover:text-black hover:underline"
            >
              Reset
            </button>
            <button
              type="submit"
              className="self-end mt-4 px-3 py-2 text-gray-600 hover:text-black hover:underline"
            >
              Apply
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-col gap-3 text-align-start">
          {Object.entries(defaultFormValues).map(([key, value]) => (
            <div key={`${projectMetadata.label}_prop_${key}`}>
              <div children={key} className="text-sm fw-700" />
              <div>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};