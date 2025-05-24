import { emitHttp, emitHttpJson } from "../../utils/http";
import type { Project } from "./type";
import type { ProjectFormValues } from "./form";

export const fetchProject = async (
  projectId: string
): Promise<Project | undefined> =>
  emitHttp("GET", "/project/" + projectId)
    .then((res) => res.json())
    .catch((reason) => {
      alert(`Failed to load project ${projectId}, ${reason}`);
    });

export const createProject = async (
  data: ProjectFormValues
): Promise<boolean> =>
  emitHttpJson("POST", "/project", data)
    .then((_) => true)
    .catch((reason) => {
      alert(`Failed to create a project, ${reason}`);
      return false;
    });

export const updateProject = async (
  id: number,
  data: ProjectFormValues
): Promise<boolean> =>
  emitHttpJson("put", `/project/${id}`, data)
    .then((_) => true)
    .catch((reason) => {
      alert(`Failed to update project ${id}, ${reason}`);
      return false;
    });

export const deleteProject = async (
  projectId: number,
): Promise<void> => {
  if (!confirm("Are you sure you want to delete this project?")) return;
  emitHttpJson("DELETE", `/project/${projectId}`)
    .catch((reason) => {
      alert(`Failed to delete the project, ${reason}`);
    });
}