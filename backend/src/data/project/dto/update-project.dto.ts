import { PartialType } from "@nestjs/mapped-types";
import { CreateProjectDto } from "src/data/project/dto/create-project.dto";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}