import { BaseCrudController } from "src/common/base-crud/base-crud.controller";
import { User } from "src/modules/user/user.entity";
import { UserService } from "src/modules/user/user.service";
import { CreateUserDto } from "src/modules/user/dto/create-user.dto";
import { UpdateUserDto } from "src/modules/user/dto/update-user.dto";
import { Body, Controller, Param, Post, Put } from "@nestjs/common";
import { ApiBody, ApiExtraModels } from "@nestjs/swagger";
import { SearchEntitiesDto } from "src/common/search/search-entity.dto";

@Controller('user')
@ApiExtraModels(CreateUserDto, UpdateUserDto)
export class UserController extends BaseCrudController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }

  @Post('search')
  override search(@Body() req: SearchEntitiesDto) {
    return this.service.search(req, User);
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