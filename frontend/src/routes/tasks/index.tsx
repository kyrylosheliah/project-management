import { createFileRoute, useRouter, useSearch } from '@tanstack/react-router'
import { validateSearch, type SearchParams } from '../../types/Search';
import { EntityTable } from '../../components/entity/EntityTable';
import { TaskService } from '../../entities/task/Task.service';

export const Route = createFileRoute('/tasks/')({
  component: TasksPage,
  validateSearch: validateSearch,
})

export default function TasksPage() {
  const search = useSearch({
    from: "/tasks/",
    strict: true,
  }) as SearchParams;

  const router = useRouter();

  return (<div>
    <h1 className="text-2xl mb-2">Tasks</h1>
    <EntityTable
      traverse
      edit
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
