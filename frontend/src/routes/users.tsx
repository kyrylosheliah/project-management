import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { validateSearch, type SearchParams } from '../types/Search'
import { EntityTable } from '../components/entity/Table';
import { UserService } from '../entities/user/service';

export const Route = createFileRoute('/users')({
  component: UsersPage,
  validateSearch: validateSearch,
})

export default function UsersPage() {
  const search = useSearch({
    from: Route.fullPath,
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <EntityTable
      traverse
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
