import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { Task } from "src/data/task/task.entity";
import { TaskService } from "src/data/task/task.service";
import { UpdateTaskDto } from "src/data/task/dto/update-task.dto";
import { CreateTaskDto } from "src/data/task/dto/create-task.dto";
import { Controller } from "@nestjs/common";

@Controller('task')
export class TaskController extends BaseCrudController<
  Task,
  CreateTaskDto,
  UpdateTaskDto
> {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }
}