import { createFileRoute, Link } from '@tanstack/react-router';
import { defaultSearchParams } from '../types/Search';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div>
      <h1>Home page</h1>
      <Link to="/projects" search={defaultSearchParams}>projects</Link>
    </div>
  );
}
