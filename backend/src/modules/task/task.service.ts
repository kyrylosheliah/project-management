import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/modules/task/task.entity";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService extends BaseCrudService<Task> {
  constructor(
    @InjectRepository(Task)
    protected readonly repository: Repository<Task>,
  ) {
    super(repository);
  }
}