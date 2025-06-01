import { createFileRoute } from '@tanstack/react-router';
import { EntityInfo } from '../../components/entity/EntityInfo';
import { ProjectService } from '../../entities/project/Project.service';

export const Route = createFileRoute('/projects/$id')({
  component: ProjectPage,
});

function ProjectPage() {
  const { id } = Route.useParams();

  return <EntityInfo entityId={id} service={ProjectService} />;
}
