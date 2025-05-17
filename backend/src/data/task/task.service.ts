import { InjectRepository } from "@nestjs/typeorm";
import { Task } from "src/data/task/task.entity";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class TaskService extends BaseCrudService<Task> {
  constructor(
    @InjectRepository(Task)
    protected repository: Repository<Task>,
  ) {
    super(repository);
  }
}