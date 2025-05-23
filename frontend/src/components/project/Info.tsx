import { useQuery } from "@tanstack/react-query";
import { deleteProject, fetchProject } from "../../models/project/service";
import { ProjectForm } from "./Form";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";

export const ProjectInfo: React.FC<{
  projectId: string;
}> = (params) => {
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["/project/" + params.projectId],
    queryFn: () => fetchProject(params.projectId),
  });

  const [edit, setEdit] = useState(false);

  const loadingElement = <div>Loading ...</div>;

  return (
    <div className="flex flex-col md:flex-row md:max-w-screen-lg md:w-auto">
      <div className="flex flex-col justify-start items-center p-8 p-t-4 border-gray-300 border-b md:border-b-0 md:border-r">
        {isPending || data === undefined ? (
          loadingElement
        ) : (
          <>
            <div className="mb-4 w-full flex items-center justify-between">
              <button
                onClick={() => router.history.back()}
                className="items-center p-1 rounded-lg text-gray-600 hover:underline hover:text-black"
              >
                ← Back
              </button>
              {edit ? (
                <button
                  onClick={() => setEdit(false)}
                  className="items-center p-1 rounded-lg text-gray-600 hover:underline hover:text-black"
                >
                  Close edit
                </button>
              ) : (
                <button
                  onClick={() => setEdit(true)}
                  className="items-center p-1 rounded-lg text-gray-600 hover:underline hover:text-black"
                >
                  Edit ...
                </button>
              )}
            </div>
            <div className="w-full">
              <ProjectForm edit={edit} project={data} />
            </div>
            {edit && (
              <div className="self-end m-t-4 flex flex-col justify-end gap-4">
                <button
                  onClick={() => deleteProject(data.id)}
                  className="self-end items-center p-1 rounded-lg text-red-800 hover:underline hover:text-red-500"
                >
                  Delete Project...
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="w-full">
        {isPending || data === undefined ? (
          loadingElement
        ) : (
          <ProjectForm edit={edit} project={data} />
        )}
      </div>
    </div>
  );
};
