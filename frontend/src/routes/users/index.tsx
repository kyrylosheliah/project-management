import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { validateSearch, type SearchParams } from '../../types/Search'
import { EntityTable } from '../../components/entity/EntityTable';
import { UserService } from '../../entities/user/User.service';

export const Route = createFileRoute('/users/')({
  component: UsersPage,
  validateSearch: validateSearch,
})

export default function UsersPage() {
  const search = useSearch({
    from: "/users/",
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <h1 className="text-2xl mb-2">Users</h1>
    <EntityTable
      traverse
      edit
      service={UserService}
      searchParams={{
        value: search,
        set: (nextSearch: SearchParams) => {
          router.navigate({
            to: Route.fullPath,
            search: nextSearch,
            replace: true,
          });
        },
      }}
    />
  </div>);
}
