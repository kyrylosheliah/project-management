import { emitHttp, emitHttpJson } from "../../utils/http";
import type { Project } from "./entity";
import type { ProjectFormValues } from "./schema";

export const fetchAllProjects = async (): Promise<Project[]> => {
  const res = await emitHttp("GET", "/project/all");
  if (!res.ok) {
    const error = await res.text();
    alert(`Failed to load projects ${error}`);
    return [];
  }
  const projects = await res.json();
  return projects;
};

export const createProject = async (data: ProjectFormValues): Promise<boolean> => {
  const res = await emitHttpJson("POST", "/project", data);
  if (!res.ok) alert("Failed to create a project");
  return res.ok;
};
