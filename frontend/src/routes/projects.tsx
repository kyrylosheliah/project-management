import { createFileRoute, useSearch } from "@tanstack/react-router";
import { EntityTable } from "../components/EntitiySearch";
import { projectMetadata } from "../models/project/metadata";
import { SearchSchema, type SearchParams } from "../types/Search";

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

  return (<div>
    <EntityTable metadata={projectMetadata} search={search} />
  </div>);
}
