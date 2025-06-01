import { createFileRoute, Link } from '@tanstack/react-router';
import { defaultSearchParams } from '../types/Search';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col items-center justify-start">
      <div className="max-w-2xl w-full mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome Home</h1>
        <div className="bg-white p-6">
          <p className="text-gray-600 mb-4">
            Breadcrumbs in action.
          </p>
          <div className="space-y-2">
            <Link
              to="/projects"
              search={defaultSearchParams}
              className="text-blue-600 hover:text-blue-700 block"
            >
              → List Projects
            </Link>
            <Link
              to="/users"
              search={defaultSearchParams}
              className="text-blue-600 hover:text-blue-700 block"
            >
              → List Users
            </Link>
            <Link
              to="/tasks"
              search={defaultSearchParams}
              className="text-blue-600 hover:text-blue-700 block"
            >
              → List Tasks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
