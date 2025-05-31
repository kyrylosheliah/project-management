import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { validateSearch, type SearchParams } from '../types/Search';
import { EntityTable } from '../components/entity/Table';
import { TaskService } from '../entities/task/service';

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
  validateSearch: validateSearch,
})

function TasksPage() {
  return <div>Hello "/tasks"!</div>
}

export default function ProjectsPage() {
  const search = useSearch({
    from: Route.fullPath,
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <EntityTable
      traverse
      service={TaskService}
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
