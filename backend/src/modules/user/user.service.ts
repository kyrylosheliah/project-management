import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/modules/user/user.entity";
import { BaseCrudService } from "src/common/base-crud/base-crud.service";
import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService extends BaseCrudService<User> {
  constructor(
    @InjectRepository(User)
    protected readonly repository: Repository<User>
  ) {
    super(repository);
  }
}