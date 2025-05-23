import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { Task } from "src/data/task/task.entity";
import { TaskService } from "src/data/task/task.service";
import { UpdateTaskDto } from "src/data/task/dto/update-task.dto";
import { CreateTaskDto } from "src/data/task/dto/create-task.dto";
import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiExtraModels } from "@nestjs/swagger";

@Controller('task')
@ApiExtraModels(CreateTaskDto, UpdateTaskDto)
export class TaskController extends BaseCrudController<Task> {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }

  @Post()
  @ApiBody({ type: CreateTaskDto })
  override create(@Body() createDto: CreateTaskDto) {
    return super.create(createDto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateTaskDto })
  override update(@Param('id') id: number, @Body() updateDto: UpdateTaskDto) {
    return super.update(id, updateDto);
  }
}