import { createFileRoute } from '@tanstack/react-router';
import { ProjectInfo } from '../components/project/Info';

export const Route = createFileRoute('/project/$projectId')({
  //loader: async ({ params }) => (fetchPost(params.projectId)),
  component: ProjectPage,
});

function ProjectPage() {
  const { projectId } = Route.useParams()
  return (
    <div>
      Hello "/project/$projectId"!
      <ProjectInfo projectId={projectId} />
    </div>
  );
}
