import { PartialType } from "@nestjs/mapped-types";
import { CreateTaskDto } from "src/data/task/dto/create-task.dto";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}