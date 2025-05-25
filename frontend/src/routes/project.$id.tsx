import { createFileRoute, useSearch } from '@tanstack/react-router';
import { ProjectInfo } from '../components/project/Info';
import { SearchSchema, type SearchParams } from '../types/Search';

export const Route = createFileRoute('/project/$id')({
  //loader: async ({ params }) => (fetchPost(params.id)),
  component: ProjectPage,
  validateSearch: (search) => {
    const result = SearchSchema.safeParse(search);
    if (!result.success) throw new Error('Invalid query params');
    return result.data;
  },
});

function ProjectPage() {
  const { id } = Route.useParams();
  const search = useSearch({
      from: Route.fullPath,
      strict: true,
    }) as SearchParams;
  return (
    <div>
      Hello "/project/$id"!
      <ProjectInfo projectId={id} search={search} />
    </div>
  );
}
