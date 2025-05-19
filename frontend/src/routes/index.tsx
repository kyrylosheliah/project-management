import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <div>
      <h1>Home page</h1>
      <Link to="/projects">projects</Link>
    </div>
  );
}
