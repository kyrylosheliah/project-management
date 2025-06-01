import { PartialType } from "@nestjs/swagger";
import { CreateTaskDto } from "src/modules/task/dto/create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}