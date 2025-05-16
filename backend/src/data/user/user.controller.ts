import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { User } from "src/data/user/user.entity";
import { UserService } from "src/data/user/user.service";
import { CreateUserDto } from "src/data/user/user/create-user.dto";
import { UpdateUserDto } from "src/data/user/user/update-user.dto";
import { Controller } from "@nestjs/common";

@Controller('user')
export class UserController extends BaseCrudController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}