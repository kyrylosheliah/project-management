import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiExtraModels } from "@nestjs/swagger";
import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { SearchEntitiesDto } from "src/common/search/search-entity.dto";
import { CreateProjectDto } from "src/modules/project/dto/create-project.dto";
import { UpdateProjectDto } from "src/modules/project/dto/update-project.dto";
import { Project } from "src/modules/project/project.entity";
import { ProjectService } from "src/modules/project/project.service";

@Controller('project')
@ApiExtraModels(CreateProjectDto, UpdateProjectDto)
export class ProjectController extends BaseCrudController<Project> {
  constructor(private readonly projectService: ProjectService) {
    super(projectService);
  }

  @Post('search')
  override search (@Body() req: SearchEntitiesDto) {
    return this.service.search(req, Project);
  }

  @Post()
  @ApiBody({ type: CreateProjectDto })
  override create(@Body() createDto: CreateProjectDto) {
    return super.create(createDto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateProjectDto })
  override update(@Param('id') id: number, @Body() updateDto: UpdateProjectDto) {
    return super.update(id, updateDto);
  }
}