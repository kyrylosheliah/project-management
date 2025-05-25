import { useQuery } from "@tanstack/react-query";
import { deleteProject, getProject } from "../../models/project/service";
import { ProjectForm } from "./Form";
import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import ButtonText from "../ButtonText";
import { EntityTableSearch } from "../EntityTableSearch";
import { taskMetadata } from "../../models/task/metadata";
import type { SearchParams } from "../../types/Search";

export const ProjectInfo: React.FC<{
  projectId: string;
  search: SearchParams;
}> = (params) => {
  const router = useRouter();

  const { data, isPending } = useQuery({
    queryKey: ["/project/" + params.projectId],
    queryFn: () => getProject(params.projectId),
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
              <ButtonText
                props={{
                  onClick: () => router.history.back(),
                }}
              >
                ← Back
              </ButtonText>
              {edit ? (
                <ButtonText
                  props={{
                    onClick: () => setEdit(false),
                  }}
                >
                  Close edit
                </ButtonText>
              ) : (
                <ButtonText
                  props={{
                    onClick: () => setEdit(true),
                  }}
                >
                  Edit ...
                </ButtonText>
              )}
            </div>
            <div className="w-full">
              <ProjectForm edit={edit} project={data} />
            </div>
            {edit && (
              <div className="self-end m-t-4 flex flex-col justify-end gap-4">
                <ButtonText
                  type="danger"
                  props={{
                    onClick: () => deleteProject(data.id),
                    className: "self-end",
                  }}
                >
                  Delete Project...
                </ButtonText>
              </div>
            )}
          </>
        )}
      </div>
      <div className="w-full">
        {isPending || data === undefined ? (
          loadingElement
        ) : (
          <EntityTableSearch metadata={taskMetadata} search={params.search} />
        )}
      </div>
    </div>
  );
};
