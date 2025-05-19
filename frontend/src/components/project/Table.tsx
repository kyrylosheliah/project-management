import { useQuery } from "@tanstack/react-query";
import { fetchAllProjects } from "../../data/project/services";
import type { Project } from "../../data/project/entity";
import { ProjectForm } from "./Form";

export const ProjectTable: React.FC = () => {
  const {
    data,
    isPending,
  } = useQuery({
    queryKey: ["/project/all"],
    queryFn: fetchAllProjects,
  });

  return (
    <div className="space-y-4 p-4 border rounded shadow-sm max-w-md">
      {
        isPending ? <p>Loading ...</p> : 
          data && data.length
            ? data.map((p: Project) => <div>{JSON.stringify(p)}</div>)
            : <div>No projects found</div>
      }
      <button
        disabled={isPending}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isPending ? "Creating..." : "New Project"}
      </button>
    </div>
  );
};

//isPending ? <p>Loading ...</p> :