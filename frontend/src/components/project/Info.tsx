import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "./Form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import ButtonText from "../ButtonText";
import { defaultSearchParams, type SearchParams } from "../../types/Search";
import { EntityTable } from "../EntityTable";
import { ProjectService } from "../../models/project/service";
import { TaskService } from "../../models/task/service";

export const ProjectInfo: React.FC<{
  projectId: string;
  search: SearchParams;
}> = (params) => {
  const navigate = useNavigate();

  const { data, isPending } = useQuery({
    queryKey: ["/project/" + params.projectId],
    queryFn: () => ProjectService.get(params.projectId),
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
                  onClick: () =>
                    navigate({ to: "/projects", search: defaultSearchParams }),
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
                    onClick: () => ProjectService.delete(data.id),
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
          <EntityTable
            service={TaskService}
            search={params.search}
            filter={{ key: "projectId", value: params.projectId }}
            type="edit"
          />
        )}
      </div>
    </div>
  );
};
