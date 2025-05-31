import { createFileRoute } from '@tanstack/react-router';
import { EntityInfo } from '../components/entity/Info';
import { UserService } from '../entities/user/service';

export const Route = createFileRoute('/user/$id')({
  component: UserPage,
});

function UserPage() {
  const { id } = Route.useParams();

  return (
  <div>
    Hello "/user/$id"!
      <EntityInfo entityId={id} service={UserService} />
    </div>);
}
