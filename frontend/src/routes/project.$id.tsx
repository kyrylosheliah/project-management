import { createFileRoute } from '@tanstack/react-router';
import { ProjectInfo } from '../components/project/Info';

export const Route = createFileRoute('/project/$id')({
  //loader: async ({ params }) => (fetchPost(params.id)),
  component: ProjectPage,
});

function ProjectPage() {
  const { id } = Route.useParams()
  return (
    <div>
      Hello "/project/$id"!
      <ProjectInfo projectId={id} />
    </div>
  );
}
