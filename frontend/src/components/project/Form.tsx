import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { createProject } from "../../data/project/services";
import { ProjectSchema, type ProjectFormValues } from "../../data/project/schema";
import type { Project } from "../../data/project/entity";

export const ProjectForm: React.FC<{
  edit?: boolean,
  project: Project
}> = (params) => {
  const [successMessage, setSuccessMessage] = useState("");
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(ProjectSchema),
  });

  const mutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      setSuccessMessage("Project created!");
      reset();
    },
    onError: () => {
      setSuccessMessage("Failed to create project.");
    }
  });

  const onSubmit = (data: ProjectFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4 border rounded shadow-sm max-w-md">
      <h2 className="text-xl font-semibold">Create Project</h2>

      <div>
        <label className="block text-sm font-medium">Title</label>
        <input {...register("title")} className="border p-2 w-full rounded" />
        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea {...register("description")} className="border p-2 w-full rounded" />
      </div>

      <div>
        <label className="block text-sm font-medium">Owner</label>
        <select {...register("ownerId")} className="border p-2 w-full rounded">
          <option value="">Select owner</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>
              {owner.name}
            </option>
          ))}
        </select>
        {errors.ownerId && <p className="text-red-500 text-sm">{errors.ownerId.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {mutation.isPending ? "Creating..." : "Create Project"}
      </button>

      {successMessage && <p className="text-sm mt-2">{successMessage}</p>}
    </form>
  );
};
