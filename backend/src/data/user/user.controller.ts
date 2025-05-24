import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { User } from "src/data/user/user.entity";
import { UserService } from "src/data/user/user.service";
import { CreateUserDto } from "src/data/user/dto/create-user.dto";
import { UpdateUserDto } from "src/data/user/dto/update-user.dto";
import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiExtraModels } from "@nestjs/swagger";

@Controller('user')
@ApiExtraModels(CreateUserDto, UpdateUserDto)
export class UserController extends BaseCrudController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post()
  @ApiBody({ type: CreateUserDto })
  override create(@Body() createDto: CreateUserDto) {
    return super.create(createDto);
  }

  @Put(':id')
  @ApiBody({ type: UpdateUserDto })
  override update(@Param('id') id: number, @Body() updateDto: UpdateUserDto) {
    return super.update(id, updateDto);
  }
}