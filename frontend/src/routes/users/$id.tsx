import { createFileRoute } from '@tanstack/react-router';
import { EntityInfo } from '../../components/entity/EntityInfo';
import { UserService } from '../../entities/user/User.service';

export const Route = createFileRoute('/users/$id')({
  component: UserPage,
});

function UserPage() {
  const { id } = Route.useParams();

  return <EntityInfo entityId={id} service={UserService} />;
}
