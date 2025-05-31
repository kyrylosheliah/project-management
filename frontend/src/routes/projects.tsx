import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { validateSearch, type SearchParams } from "../types/Search";
import { EntityTable } from "../components/entity/Table";
import { ProjectService } from "../entities/project/service";

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
  validateSearch: validateSearch,
});

export default function ProjectsPage() {
  const search = useSearch({
    from: Route.fullPath,
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <EntityTable
      traverse
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
