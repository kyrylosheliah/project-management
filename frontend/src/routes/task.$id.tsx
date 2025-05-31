import { createFileRoute } from '@tanstack/react-router';
import { EntityInfo } from '../components/entity/Info';
import { TaskService } from '../entities/task/service';

export const Route = createFileRoute('/task/$id')({
  component: TaskPage,
});

function TaskPage() {
  const { id } = Route.useParams();

  return (
    <div>
      Hello "/task/$id"!
      <EntityInfo entityId={id} service={TaskService} />
    </div>
  );
}
