import { createFileRoute } from '@tanstack/react-router';
import { EntityInfo } from '../components/entity/Info';
import { ProjectService } from '../entities/project/service';

export const Route = createFileRoute('/project/$id')({
  component: ProjectPage,
});

function ProjectPage() {
  const { id } = Route.useParams();

  return (
    <div>
      Hello "/project/$id"!
      <EntityInfo entityId={id} service={ProjectService} />
    </div>
  );
}
