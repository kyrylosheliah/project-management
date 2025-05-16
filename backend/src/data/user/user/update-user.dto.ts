import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/data/user/user/create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {}