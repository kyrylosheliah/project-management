import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { Task } from "src/modules/task/task.entity";
import { TaskService } from "src/modules/task/task.service";
import { UpdateTaskDto } from "src/modules/task/dto/update-task.dto";
import { CreateTaskDto } from "src/modules/task/dto/create-task.dto";
import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiExtraModels } from "@nestjs/swagger";
import { SearchEntitiesDto } from "src/common/search/search-entity.dto";

@Controller('task')
@ApiExtraModels(CreateTaskDto, UpdateTaskDto)
export class TaskController extends BaseCrudController<Task> {
  constructor(private readonly taskService: TaskService) {
    super(taskService);
  }

  @Post('search')
  override search(@Body() req: SearchEntitiesDto) {
    return this.service.search(req, Task);
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