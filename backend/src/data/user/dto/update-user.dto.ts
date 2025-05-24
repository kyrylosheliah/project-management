import { PartialType } from "@nestjs/swagger";
import { CreateUserDto } from "src/data/user/dto/create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}