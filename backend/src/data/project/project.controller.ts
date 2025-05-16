import { Controller } from "@nestjs/common";
import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { CreateProjectDto } from "src/data/project/dto/create-project.dto";
import { UpdateProjectDto } from "src/data/project/dto/update-project.dto";
import { Project } from "src/data/project/project.entity";
import { ProjectService } from "src/data/project/project.service";

@Controller('project')
export class ProjectController extends BaseCrudController<
  Project,
  CreateProjectDto,
  UpdateProjectDto
> {
  constructor(private readonly projectService: ProjectService) {
    super(projectService);
  }
}