import { createFileRoute, useSearch } from "@tanstack/react-router";
import { projectMetadata } from "../models/project/metadata";
import { EntityTableSearch } from "../components/EntityTableSearch";
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
    <EntityTableSearch metadata={projectMetadata} search={search} />
  </div>);
}
