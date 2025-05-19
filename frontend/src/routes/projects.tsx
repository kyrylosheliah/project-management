import { createFileRoute } from "@tanstack/react-router";
import { ProjectTable } from "../components/project/Table";

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
});

export default function ProjectsPage() {
  return (<div>
    <h1 className="text-2xl font-semibold mb-4">
      New ...
    </h1>
    <ProjectTable />
  </div>);
}
