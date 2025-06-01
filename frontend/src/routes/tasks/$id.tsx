import { createFileRoute } from '@tanstack/react-router';
import { EntityInfo } from '../../components/entity/EntityInfo';
import { TaskService } from '../../entities/task/Task.service';

export const Route = createFileRoute('/tasks/$id')({
  component: TaskPage,
});

function TaskPage() {
  const { id } = Route.useParams();

  return <EntityInfo entityId={id} service={TaskService} />;
}
