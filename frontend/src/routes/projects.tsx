import { createFileRoute, useRouter, useSearch } from "@tanstack/react-router";
import { SearchSchema, type SearchParams } from "../types/Search";
import { EntityTable } from "../components/entity/Table";
import { ProjectService } from "../entities/project/service";

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
  validateSearch: (search) => {
    const result = SearchSchema.safeParse(search);
    if (!result.success) throw new Error('Invalid query params');
    return result.data;
  },
});

export default function ProjectsPage() {
  const search = useSearch({
    from: Route.fullPath,
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <EntityTable
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
