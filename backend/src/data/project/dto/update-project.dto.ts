import { PartialType } from "@nestjs/swagger";
import { CreateProjectDto } from "src/data/project/dto/create-project.dto";

export class UpdateProjectDto extends PartialType(CreateProjectDto) {}