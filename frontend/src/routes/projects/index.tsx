import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { validateSearch, type SearchParams } from "../../types/Search";
import { EntityTable } from "../../components/entity/EntityTable";
import { ProjectService } from "../../entities/project/Project.service";

export const Route = createFileRoute('/projects/')({
  component: ProjectsPage,
  validateSearch: validateSearch,
});

export default function ProjectsPage() {
  const search = useSearch({
    from: "/projects/",
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <h1 className="text-2xl mb-2">Projects</h1>
    <EntityTable
      traverse
      edit
      service={ProjectService}
      searchParams={{
        value: search,
        set: (nextSearch: SearchParams) => {
          router.navigate({
            to: Route.fullPath,
            search: nextSearch,
            replace: true,
          });
        },
      }}
    />
  </div>);
}
