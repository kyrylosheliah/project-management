import { InjectRepository } from "@nestjs/typeorm";
import { Project } from "src/modules/project/project.entity";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ProjectService extends BaseCrudService<Project> {
  constructor(
    @InjectRepository(Project)
    protected readonly projectRepository: Repository<Project>,
  ){
    super(projectRepository)
  }
}